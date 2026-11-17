(() => {
  "use strict";

  const { tracks, skillAliases, resources, profile } = window.CareerData;
  const STORAGE_KEY = "career_analyzer_state_v3";
  const LEVELS = ["Beginner", "Intermediate", "Advanced"];
  const DEFAULT_QUICK_SKILLS = ["Python", "C", "C++", "JavaScript", "HTML/CSS", "SQL", "Git"];

  let completedRecommended = new Set(); // recommended skills the user marked as learned
  let weeksDone = new Set();            // study-plan row indexes marked as done
  let currentAnalysis = null;
  let lastWrittenHash = "";

  /* ---------- Helpers ---------- */

  const $ = id => document.getElementById(id);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function foldText(str) {
    return str
      .toLowerCase()
      .replace(/ı/g, "i")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseSkills(raw) {
    return raw.split(",").map(s => s.trim()).filter(Boolean);
  }

  function normalizeSkill(skill) {
    const clean = skill.trim().replace(/\s+/g, " ");
    return skillAliases[clean.toLowerCase()] || clean;
  }

  // Normalize + remove duplicates (e.g. "HTML, CSS" → "HTML/CSS" once).
  function cleanSkillList(raw) {
    const seen = new Set();
    const result = [];
    parseSkills(raw).map(normalizeSkill).forEach(skill => {
      const key = skill.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(skill);
      }
    });
    return result;
  }

  const sameSkill = (a, b) => a.toLowerCase() === b.toLowerCase();

  function findTrackId(goal) {
    const key = foldText(goal);
    if (!key) return null;
    if (tracks[key]) return key;
    return Object.keys(tracks).find(id =>
      foldText(tracks[id].label) === key || tracks[id].aliases.includes(key)
    ) || null;
  }

  const storage = {
    get() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) { return null; }
    },
    set(data) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
    },
    clear() {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }
  };

  let toastTimer = null;
  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 1800);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Fallback for browsers/contexts without the async clipboard API
      const area = el("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
      area.remove();
      return ok;
    }
  }

  /* ---------- Profile (About You) ---------- */

  function fillSelect(selectId, entries, defaultValue) {
    const select = $(selectId);
    entries.forEach(([value, label]) => {
      const opt = new Option(label, value);
      if (value === defaultValue) {
        opt.defaultSelected = true;
        opt.selected = true;
      }
      select.add(opt);
    });
  }

  function setupProfileFields() {
    fillSelect("hoursSelect",
      profile.hours.map(h => [String(h), `${h} hours / week${h === profile.baselineHours ? " (standard)" : ""}`]),
      String(profile.baselineHours));
    fillSelect("educationSelect", Object.entries(profile.education).map(([k, v]) => [k, v.label]));
    fillSelect("goalTypeSelect", Object.entries(profile.goalTypes).map(([k, v]) => [k, v.label]));
    fillSelect("styleSelect", Object.entries(profile.learningStyles).map(([k, v]) => [k, v.label]));
  }

  function readProfile() {
    const hours = Number($("hoursSelect").value) || profile.baselineHours;
    return {
      hours,
      edu: profile.education[$("educationSelect").value] ? $("educationSelect").value : "",
      dept: $("departmentInput").value.trim().replace(/\s+/g, " ").slice(0, 60),
      gtype: profile.goalTypes[$("goalTypeSelect").value] ? $("goalTypeSelect").value : "",
      style: profile.learningStyles[$("styleSelect").value] ? $("styleSelect").value : ""
    };
  }

  function writeProfile(p) {
    const hours = profile.hours.includes(Number(p.hours)) ? String(p.hours) : String(profile.baselineHours);
    $("hoursSelect").value = hours;
    $("educationSelect").value = profile.education[p.edu] ? p.edu : "";
    $("departmentInput").value = (p.dept || "").slice(0, 60);
    $("goalTypeSelect").value = profile.goalTypes[p.gtype] ? p.gtype : "";
    $("styleSelect").value = profile.learningStyles[p.style] ? p.style : "";
  }

  const fillTrack = (text, track) => text.replace(/\{track\}/g, track.label);

  // "Weeks 4–6" → {start: 4, end: 6}
  function parseWeekRange(text) {
    const m = text.match(/Weeks?\s+(\d+)(?:\s*[–-]\s*(\d+))?/);
    return m ? { start: Number(m[1]), end: Number(m[2] || m[1]), match: m[0] } : null;
  }

  const formatWeekRange = (a, b) => (a === b ? `Week ${a}` : `Weeks ${a}–${b}`);

  // Stretch or compress contiguous week ranges by `factor` (each period keeps at least 1 week).
  function retimeTexts(texts, factor) {
    let lastEnd = 0;
    return texts.map(text => {
      const range = parseWeekRange(text);
      if (!range) return text;
      const start = lastEnd + 1;
      const end = Math.max(start, Math.round(range.end * factor));
      lastEnd = end;
      return text.replace(range.match, formatWeekRange(start, end));
    });
  }

  // "3h …; 2h …" → scaled to the user's weekly hours (rounded to 0.5h)
  function scaleRoutine(text, hours) {
    return text.replace(/(\d+(?:\.\d+)?)h\b/g, (_, n) => {
      const scaled = Math.max(0.5, Math.round((Number(n) * hours / profile.baselineHours) * 2) / 2);
      return `${scaled}h`;
    });
  }

  function personalizePlan(track, level, hours) {
    const factor = profile.baselineHours / hours;
    const base = track.studyPlan[level] || track.studyPlan.Beginner;
    const periods = retimeTexts(base.map(r => r.period), factor);
    const plan = base.map((row, i) => ({ ...row, period: periods[i], routine: scaleRoutine(row.routine, hours) }));
    const lastRange = parseWeekRange(periods[periods.length - 1]);
    const totalWeeks = lastRange ? lastRange.end : profile.baselineWeeks;

    // Roadmap phases end where plan periods end, so reuse the plan's new week numbers.
    const endMap = new Map(base.map((row, i) => [parseWeekRange(row.period)?.end, parseWeekRange(periods[i])?.end]));
    const baseSteps = track.roadmap[level] || track.roadmap.Beginner;
    let lastEnd = 0;
    const roadmap = baseSteps.map(step => {
      const range = parseWeekRange(step.title);
      if (!range) return { ...step };
      const start = lastEnd + 1;
      const end = Math.max(start, endMap.get(range.end) ?? Math.round(range.end * factor));
      lastEnd = end;
      return { ...step, title: step.title.replace(range.match, formatWeekRange(start, end)) };
    });
    return { plan, roadmap, totalWeeks };
  }

  function isRelatedDepartment(dept) {
    const folded = foldText(dept);
    return profile.relatedDepartmentKeywords.some(k => folded.includes(k));
  }

  function buildTips(analysis) {
    const { track, prof, totalWeeks } = analysis;
    const tips = [];
    if (prof.hours < profile.baselineHours) {
      tips.push(`With ${prof.hours} h/week your plan is stretched to ${totalWeeks} weeks — steady weekly progress beats occasional long sessions.`);
    } else if (prof.hours > profile.baselineHours) {
      tips.push(`With ${prof.hours} h/week you can finish the plan in about ${totalWeeks} weeks. Keep at least one rest day each week.`);
    }
    if (prof.edu) tips.push(fillTrack(profile.education[prof.edu].tip, track));
    if (prof.dept) {
      tips.push(isRelatedDepartment(prof.dept)
        ? `Your ${prof.dept} background already covers some foundations — spend most of your time on the core ${track.label} skills.`
        : `Your ${prof.dept} background is an asset: build ${track.label} projects that solve problems from that field to make your portfolio stand out.`);
    }
    if (prof.style) tips.push(profile.learningStyles[prof.style].tip);

    const goal = prof.gtype ? profile.goalTypes[prof.gtype] : null;
    const checklist = goal
      ? { title: `${goal.label} Checklist (alongside your plan)`, steps: goal.steps.map(s => fillTrack(s, track)) }
      : null;
    return { tips, checklist };
  }

  function renderTips() {
    const { tips, checklist } = buildTips(currentAnalysis);
    $("tipsList").replaceChildren(...tips.map(t => el("li", "", t)));
    $("tipsList").hidden = tips.length === 0;

    const box = $("goalChecklist");
    box.replaceChildren();
    if (checklist) {
      const wrap = el("div", "checklist");
      const ol = el("ol");
      checklist.steps.forEach(s => ol.appendChild(el("li", "", s)));
      wrap.append(el("strong", "", checklist.title), ol);
      box.appendChild(wrap);
    }
    $("tipsBlock").hidden = tips.length === 0 && !checklist;
  }

  /* ---------- Form helpers ---------- */

  function renderQuickSkills() {
    const trackId = findTrackId($("goalInput").value);
    const list = trackId ? tracks[trackId].skills : DEFAULT_QUICK_SKILLS;
    const container = $("quickSkills");
    container.replaceChildren(...list.map(skill => {
      const btn = el("button", "pill-btn", `+ ${skill}`);
      btn.type = "button";
      btn.addEventListener("click", () => addSkill(skill));
      return btn;
    }));

    document.querySelectorAll("#goalPills .pill-btn").forEach(btn => {
      const active = btn.dataset.track === trackId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function addSkill(skillName) {
    const input = $("skillsInput");
    const current = cleanSkillList(input.value);
    const normalized = normalizeSkill(skillName);
    if (!current.some(s => sameSkill(s, normalized))) {
      current.push(normalized);
      input.value = current.join(", ");
      $("skillsError").hidden = true;
      input.removeAttribute("aria-invalid");
    }
  }

  const PRESETS = {
    ai: {
      skills: "Python, C, C++", goal: "ai", level: "Beginner",
      profile: { hours: 5, edu: "uni12", dept: "Computer Engineering", gtype: "internship", style: "handson" }
    },
    web: {
      skills: "HTML/CSS, Git", goal: "web", level: "Beginner",
      profile: { hours: 10, edu: "graduate", dept: "", gtype: "firstjob", style: "video" }
    },
    data: {
      skills: "Python, SQL, Pandas, Excel", goal: "data", level: "Intermediate",
      profile: { hours: 8, edu: "professional", dept: "Business Administration", gtype: "switch", style: "course" }
    }
  };

  function loadPreset(name) {
    const preset = PRESETS[name];
    if (!preset) return;
    $("skillsInput").value = preset.skills;
    $("goalInput").value = tracks[preset.goal].label;
    $("levelSelect").value = preset.level;
    writeProfile(preset.profile);
    startNewAnalysis();
  }

  function validate(userSkills, goalRaw, level) {
    const checks = [
      [userSkills.length === 0, "skillsError", "skillsInput"],
      [!goalRaw, "goalError", "goalInput"],
      [!level, "levelError", "levelSelect"]
    ];
    let firstInvalid = null;
    checks.forEach(([invalid, errorId, fieldId]) => {
      $(errorId).hidden = !invalid;
      if (invalid) $(fieldId).setAttribute("aria-invalid", "true");
      else $(fieldId).removeAttribute("aria-invalid");
      if (invalid && !firstInvalid) firstInvalid = $(fieldId);
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  /* ---------- Scoring ---------- */

  function computeScore(analysis) {
    const { userSkills, track } = analysis;
    const core = track.skills;
    const have = core.filter(req => userSkills.some(u => sameSkill(u, req)));
    const missing = core.filter(req => !have.includes(req));
    const completed = missing.filter(req => completedRecommended.has(req));
    const remaining = missing.filter(req => !completedRecommended.has(req));

    const effectiveMatched = have.length + completed.length;
    const coreRatio = Math.round((effectiveMatched / core.length) * 85);
    const foundations = userSkills.filter(u => track.foundationalSkills.some(f => sameSkill(f, u)));
    const foundationBonus = Math.min(15, foundations.length * 7);
    const finalScore = Math.min(100, coreRatio + foundationBonus);

    return { have, completed, remaining, effectiveMatched, coreRatio, foundations, foundationBonus, finalScore };
  }

  /* ---------- Rendering ---------- */

  function toggleRecommended(skillName) {
    if (completedRecommended.has(skillName)) completedRecommended.delete(skillName);
    else completedRecommended.add(skillName);
    renderScoreAndSkills();
    saveState();
    const btn = document.querySelector(`#skillList [data-skill="${CSS.escape(skillName)}"]`);
    if (btn) btn.focus();
  }

  function sortedResources(skill, style) {
    const list = (resources[skill] || []).slice();
    if (!style) return list;
    const order = profile.learningStyles[style].order;
    const rank = r => { const i = order.indexOf(r.type); return i === -1 ? order.length : i; };
    return list.sort((a, b) => rank(a) - rank(b)); // stable sort keeps original order on ties
  }

  function resourceLinks(skill) {
    const style = currentAnalysis.prof.style;
    const preferredType = style ? profile.learningStyles[style].order[0] : null;
    const wrap = el("div", "resource-links");
    sortedResources(skill, style).forEach(r => {
      const isMatch = r.type === preferredType;
      const a = el("a", isMatch ? "style-match" : "", `${r.label} ↗ `);
      a.href = r.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      if (isMatch) a.title = "Matches your learning style";
      a.appendChild(el("span", "resource-type", profile.resourceTypeLabels[r.type] || ""));
      wrap.appendChild(a);
    });
    return wrap;
  }

  function renderScoreAndSkills() {
    if (!currentAnalysis) return;
    const { userSkills, track } = currentAnalysis;
    const score = computeScore(currentAnalysis);

    // Skill tags
    const skillList = $("skillList");
    skillList.replaceChildren();
    track.skills.forEach(req => {
      if (score.have.includes(req)) {
        skillList.appendChild(el("span", "skill-tag have", `✓ ${req} (Have)`));
        return;
      }
      const done = score.completed.includes(req);
      const btn = el("button", `skill-tag ${done ? "completed" : "missing"}`,
        done ? `✓ ${req} (Completed)` : `+ ${req} (Recommended)`);
      btn.type = "button";
      btn.dataset.skill = req;
      btn.setAttribute("aria-pressed", done ? "true" : "false");
      btn.title = done ? "Click to mark as not completed" : "Click to mark as completed";
      btn.addEventListener("click", () => toggleRecommended(req));
      skillList.appendChild(btn);
    });

    userSkills.forEach(u => {
      if (track.skills.some(req => sameSkill(u, req))) return;
      const isFoundation = track.foundationalSkills.some(f => sameSkill(f, u));
      skillList.appendChild(
        el("span", "skill-tag have", `✓ ${u} (${isFoundation ? "Foundational" : "Additional Skill"})`)
      );
    });

    // Readiness score
    $("scoreText").textContent = `${score.finalScore}%`;
    $("scoreBar").style.width = `${score.finalScore}%`;
    $("scoreTrack").setAttribute("aria-valuenow", String(score.finalScore));
    const foundationText = score.foundations.length
      ? `${score.foundations.length} foundational skill(s): ${score.foundations.join(", ")}`
      : `0 foundational skills — ${track.foundationalSkills.join(", ")} count for this track`;
    $("formulaNote").textContent =
      `Formula: (${score.effectiveMatched}/${track.skills.length} core skills → ${score.coreRatio}%) + (${foundationText} → +${score.foundationBonus}%)`;

    // Priority list with resources (only skills that are still open)
    const priorityList = $("priorityList");
    priorityList.replaceChildren();
    if (score.remaining.length === 0) {
      const item = el("div", "priority-item");
      item.append(
        el("span", "", "All core skills covered! Focus on building and deploying end-to-end projects."),
        el("span", "priority-badge", "Ready")
      );
      priorityList.appendChild(item);
    } else {
      score.remaining.forEach((skill, idx) => {
        const item = el("div", "priority-item");
        const left = el("div");
        const note = el("div", "", track.skillNotes[skill] || `Core requirement for ${track.label}.`);
        note.style.cssText = "color:#64748b;font-size:0.81rem;margin-top:2px;";
        left.append(el("strong", "", skill), note, resourceLinks(skill));
        item.append(left, el("span", "priority-badge", idx === 0 ? "Priority #1 • Start Here" : `Priority #${idx + 1}`));
        priorityList.appendChild(item);
      });
    }
  }

  function renderPlanProgress() {
    if (!currentAnalysis) return;
    const total = currentAnalysis.plan.length;
    const done = Array.from(weeksDone).filter(i => i < total).length;
    const pct = Math.round((done / total) * 100);
    $("planProgressText").textContent = `${done} / ${total} periods (${pct}%)`;
    $("planBar").style.width = `${pct}%`;
    $("planTrack").setAttribute("aria-valuenow", String(pct));
  }

  function renderStudyPlan() {
    const { plan, level, totalWeeks, prof } = currentAnalysis;
    $("planTitle").textContent = `${totalWeeks}-Week Structured Study Plan (${level}, ${prof.hours} h/week)`;
    $("tab-plan").textContent = `${totalWeeks}-Week Study Plan`;
    const body = $("studyPlanBody");
    body.replaceChildren();
    plan.forEach((row, idx) => {
      const tr = el("tr");
      const isDone = weeksDone.has(idx);
      tr.classList.toggle("row-done", isDone);

      const doneCell = el("td", "done-col");
      const box = el("input");
      box.type = "checkbox";
      box.checked = isDone;
      box.setAttribute("aria-label", `Mark ${row.period}: ${row.focus} as done`);
      box.addEventListener("change", () => {
        if (box.checked) weeksDone.add(idx);
        else weeksDone.delete(idx);
        tr.classList.toggle("row-done", box.checked);
        renderPlanProgress();
        saveState();
      });
      doneCell.appendChild(box);

      const period = el("td");
      period.appendChild(el("strong", "", row.period));
      tr.append(doneCell, period, el("td", "", row.focus), el("td", "", row.routine), el("td", "", row.output));
      body.appendChild(tr);
    });
    renderPlanProgress();
  }

  function showUnsupported(goalRaw) {
    currentAnalysis = null;
    $("emptyState").hidden = true;
    $("resultContent").hidden = true;
    $("toolbar").hidden = true;

    const labels = Object.values(tracks).map(t => t.label);
    $("unsupportedText").textContent =
      `"${goalRaw}" is not in the catalog yet, so we can't build a reliable plan for it. ` +
      `Available tracks: ${labels.join(", ")}. Pick one below to continue.`;

    $("unsupportedOptions").replaceChildren(...Object.keys(tracks).map(id => {
      const btn = el("button", "pill-btn", tracks[id].label);
      btn.type = "button";
      btn.addEventListener("click", () => {
        $("goalInput").value = tracks[id].label;
        startNewAnalysis();
      });
      return btn;
    }));
    $("unsupportedBox").hidden = false;
    clearHash();
  }

  function analyzeCareer() {
    const userSkills = cleanSkillList($("skillsInput").value);
    const goalRaw = $("goalInput").value.trim();
    const level = $("levelSelect").value;

    if (!validate(userSkills, goalRaw, level)) return;

    $("skillsInput").value = userSkills.join(", ");

    const trackId = findTrackId(goalRaw);
    if (!trackId) {
      showUnsupported(goalRaw);
      return;
    }

    const track = tracks[trackId];
    $("goalInput").value = track.label;
    renderQuickSkills();

    const prof = readProfile();
    const { plan, roadmap, totalWeeks } = personalizePlan(track, level, prof.hours);
    currentAnalysis = { userSkills, level, trackId, track, plan, roadmap, totalWeeks, prof };

    // drop stale state that doesn't belong to this track/plan
    completedRecommended = new Set(Array.from(completedRecommended).filter(s => track.skills.includes(s)));
    weeksDone = new Set(Array.from(weeksDone).filter(i => Number.isInteger(i) && i >= 0 && i < plan.length));

    const chips = [
      `Skills: ${userSkills.join(", ")}`,
      `Career Goal: ${track.label}`,
      `Experience: ${level}`,
      `Study Time: ${prof.hours} h/week`
    ];
    if (prof.edu) chips.push(`Education: ${profile.education[prof.edu].label}${prof.dept ? ` — ${prof.dept}` : ""}`);
    else if (prof.dept) chips.push(`Field: ${prof.dept}`);
    if (prof.gtype) chips.push(`Aiming for: ${profile.goalTypes[prof.gtype].label}`);
    if (prof.style) chips.push(`Learns by: ${profile.learningStyles[prof.style].label}`);
    $("metaChips").replaceChildren(...chips.map(c => el("span", "chip", c)));

    renderScoreAndSkills();
    renderTips();

    // Roadmap
    $("roadmapTitle").textContent = `Recommended Action Roadmap (${level})`;
    $("roadmapList").replaceChildren(...roadmap.map(step => {
      const box = el("div", "step-box");
      box.append(el("strong", "", step.title), el("p", "", step.desc));
      return box;
    }));

    const full = $("fullRoadmap");
    full.replaceChildren();
    if (track.fullRoadmap) {
      const a = el("a", "", "roadmap.sh ↗");
      a.href = track.fullRoadmap;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      full.append("Want the full picture? See the community roadmap on ", a);
    }

    renderStudyPlan();

    $("emptyState").hidden = true;
    $("unsupportedBox").hidden = true;
    $("toolbar").hidden = false;
    $("resultContent").hidden = false;

    saveState();
  }

  function startNewAnalysis() {
    completedRecommended.clear();
    weeksDone.clear();
    analyzeCareer();
  }

  /* ---------- Tabs ---------- */

  function switchSubtab(name) {
    document.querySelectorAll(".subtab-btn").forEach(b => {
      const active = b.dataset.tab === name;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
      b.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll(".subpanel").forEach(p => {
      p.classList.toggle("active", p.id === `subpanel-${name}`);
    });
  }

  function handleTabKeys(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const tabs = Array.from(document.querySelectorAll(".subtab-btn"));
    const idx = tabs.indexOf(document.activeElement);
    if (idx === -1) return;
    const next = tabs[(idx + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    switchSubtab(next.dataset.tab);
    next.focus();
  }

  /* ---------- State: localStorage + shareable URL ---------- */

  function stateToParams() {
    const { userSkills, trackId, level } = currentAnalysis;
    const params = new URLSearchParams();
    params.set("skills", userSkills.join(","));
    params.set("goal", trackId);
    params.set("level", level);
    if (completedRecommended.size) params.set("done", Array.from(completedRecommended).join("|"));
    if (weeksDone.size) params.set("weeks", Array.from(weeksDone).sort((a, b) => a - b).join(","));
    const prof = currentAnalysis.prof;
    params.set("hours", String(prof.hours));
    ["edu", "dept", "gtype", "style"].forEach(key => {
      if (prof[key]) params.set(key, prof[key]);
    });
    return params;
  }

  function clearHash() {
    lastWrittenHash = "";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  }

  function saveState() {
    if (!currentAnalysis) return;
    const params = stateToParams();
    storage.set(Object.fromEntries(params));
    lastWrittenHash = `#${params.toString()}`;
    history.replaceState(null, "", lastWrittenHash);
  }

  function applyState(data) {
    if (!data || !data.skills || !data.goal || !LEVELS.includes(data.level)) return false;
    const trackId = findTrackId(data.goal);
    if (!trackId) return false;
    $("skillsInput").value = data.skills.split(",").join(", ");
    $("goalInput").value = tracks[trackId].label;
    $("levelSelect").value = data.level;
    writeProfile(data);
    completedRecommended = new Set(data.done ? data.done.split("|") : []);
    weeksDone = new Set(data.weeks ? data.weeks.split(",").map(Number) : []);
    analyzeCareer();
    return true;
  }

  function loadFromHash() {
    if (!location.hash || location.hash.length < 2) return false;
    const params = new URLSearchParams(location.hash.slice(1));
    return applyState(Object.fromEntries(params));
  }

  function loadInitialState() {
    if (loadFromHash()) return;
    applyState(storage.get());
  }

  /* ---------- Reset / copy / share / PDF ---------- */

  function resetForm() {
    $("careerForm").reset();
    $("levelSelect").value = "";
    ["skillsError", "goalError", "levelError"].forEach(id => ($(id).hidden = true));
    ["skillsInput", "goalInput", "levelSelect"].forEach(id => $(id).removeAttribute("aria-invalid"));
    $("resultContent").hidden = true;
    $("unsupportedBox").hidden = true;
    $("toolbar").hidden = true;
    $("emptyState").hidden = false;
    switchSubtab("overview");
    $("tab-plan").textContent = "Study Plan";
    completedRecommended.clear();
    weeksDone.clear();
    currentAnalysis = null;
    storage.clear();
    clearHash();
    renderQuickSkills();
  }

  function buildReportText() {
    const { userSkills, level, track, plan, roadmap, totalWeeks, prof } = currentAnalysis;
    const score = computeScore(currentAnalysis);
    const { tips, checklist } = buildTips(currentAnalysis);
    const profileLines = [`Study time: ${prof.hours} h/week (${totalWeeks}-week plan)`];
    if (prof.edu) profileLines.push(`Education: ${profile.education[prof.edu].label}${prof.dept ? ` — ${prof.dept}` : ""}`);
    else if (prof.dept) profileLines.push(`Field: ${prof.dept}`);
    if (prof.gtype) profileLines.push(`Aiming for: ${profile.goalTypes[prof.gtype].label}`);
    if (prof.style) profileLines.push(`Learns by: ${profile.learningStyles[prof.style].label}`);

    const lines = [
      `Career Goal: ${track.label}`,
      `Experience: ${level}`,
      `Skills: ${userSkills.join(", ")}`,
      ...profileLines,
      `Readiness: ${score.finalScore}%`,
      `Study plan progress: ${weeksDone.size} / ${plan.length} periods`,
      "",
      "Skills Breakdown:",
      ...Array.from(document.querySelectorAll("#skillList .skill-tag")).map(t => `- ${t.textContent}`),
      "",
      "Priority Order:",
      ...(score.remaining.length
        ? score.remaining.map((s, i) => {
            const first = sortedResources(s, prof.style)[0];
            return `${i + 1}. ${s}${first ? ` — ${first.url}` : ""}`;
          })
        : ["All core skills covered."]),
      "",
      `Roadmap (${level}):`,
      ...roadmap.map(s => `- ${s.title}: ${s.desc}`)
    ];
    if (tips.length) lines.push("", "Personalized Tips:", ...tips.map(t => `- ${t}`));
    if (checklist) lines.push("", `${checklist.title}:`, ...checklist.steps.map((s, i) => `${i + 1}. ${s}`));
    lines.push("", `Open this plan: ${location.href}`);
    return lines.join("\n");
  }

  async function copyReport() {
    if (!currentAnalysis) return;
    showToast((await copyText(buildReportText())) ? "Summary copied" : "Copy failed — please try again");
  }

  async function copyShareLink() {
    if (!currentAnalysis) return;
    saveState();
    showToast((await copyText(location.href)) ? "Share link copied" : "Copy failed — copy the address bar instead");
  }

  function saveAsPdf() {
    if (!currentAnalysis) return;
    window.print();
  }

  /* ---------- Wiring ---------- */

  function init() {
    const ids = Object.keys(tracks);
    setupProfileFields();

    // Profile changes update an existing analysis right away (progress is kept)
    ["hoursSelect", "educationSelect", "goalTypeSelect", "styleSelect"].forEach(id =>
      $(id).addEventListener("change", () => { if (currentAnalysis) analyzeCareer(); })
    );
    $("departmentInput").addEventListener("change", () => { if (currentAnalysis) analyzeCareer(); });

    $("goalSuggestions").replaceChildren(...ids.map(id => {
      const opt = document.createElement("option");
      opt.value = tracks[id].label;
      return opt;
    }));

    $("goalPills").replaceChildren(...ids.map(id => {
      const btn = el("button", "pill-btn", tracks[id].label);
      btn.type = "button";
      btn.dataset.track = id;
      btn.addEventListener("click", () => {
        $("goalInput").value = tracks[id].label;
        $("goalError").hidden = true;
        $("goalInput").removeAttribute("aria-invalid");
        renderQuickSkills();
      });
      return btn;
    }));

    $("careerForm").addEventListener("submit", event => {
      event.preventDefault();
      startNewAnalysis();
    });
    $("resetBtn").addEventListener("click", resetForm);
    $("copyBtn").addEventListener("click", copyReport);
    $("shareBtn").addEventListener("click", copyShareLink);
    $("pdfBtn").addEventListener("click", saveAsPdf);

    document.querySelectorAll("[data-preset]").forEach(btn =>
      btn.addEventListener("click", () => loadPreset(btn.dataset.preset))
    );
    document.querySelectorAll(".subtab-btn").forEach(btn =>
      btn.addEventListener("click", () => switchSubtab(btn.dataset.tab))
    );
    document.querySelector(".subtabs").addEventListener("keydown", handleTabKeys);

    [["skillsInput", "skillsError"], ["goalInput", "goalError"], ["levelSelect", "levelError"]].forEach(([fieldId, errorId]) =>
      $(fieldId).addEventListener("input", () => {
        $(errorId).hidden = true;
        $(fieldId).removeAttribute("aria-invalid");
        if (fieldId === "goalInput") renderQuickSkills();
      })
    );

    // A pasted share link in the same tab
    window.addEventListener("hashchange", () => {
      if (location.hash !== lastWrittenHash) loadFromHash();
    });

    renderQuickSkills();
    loadInitialState();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
