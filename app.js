(() => {
  "use strict";

  const { tracks, skillAliases, resources } = window.CareerData;
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
    ai: { skills: "Python, C, C++", goal: "ai", level: "Beginner" },
    web: { skills: "HTML/CSS, Git", goal: "web", level: "Beginner" },
    data: { skills: "Python, SQL, Pandas, Excel", goal: "data", level: "Intermediate" }
  };

  function loadPreset(name) {
    const preset = PRESETS[name];
    if (!preset) return;
    $("skillsInput").value = preset.skills;
    $("goalInput").value = tracks[preset.goal].label;
    $("levelSelect").value = preset.level;
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

  function resourceLinks(skill) {
    const list = resources[skill] || [];
    const wrap = el("div", "resource-links");
    list.forEach(r => {
      const a = el("a", "", `${r.label} ↗`);
      a.href = r.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
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
    const { plan, level } = currentAnalysis;
    $("planTitle").textContent = `12-Week Structured Study Plan (${level})`;
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

    const plan = track.studyPlan[level] || track.studyPlan.Beginner;
    currentAnalysis = { userSkills, level, trackId, track, plan };

    // drop stale state that doesn't belong to this track/plan
    completedRecommended = new Set(Array.from(completedRecommended).filter(s => track.skills.includes(s)));
    weeksDone = new Set(Array.from(weeksDone).filter(i => Number.isInteger(i) && i >= 0 && i < plan.length));

    $("metaChips").replaceChildren(
      el("span", "chip", `Skills: ${userSkills.join(", ")}`),
      el("span", "chip", `Career Goal: ${track.label}`),
      el("span", "chip", `Experience: ${level}`)
    );

    renderScoreAndSkills();

    // Roadmap
    $("roadmapTitle").textContent = `Recommended Action Roadmap (${level})`;
    $("roadmapList").replaceChildren(...(track.roadmap[level] || track.roadmap.Beginner).map(step => {
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
    completedRecommended.clear();
    weeksDone.clear();
    currentAnalysis = null;
    storage.clear();
    clearHash();
    renderQuickSkills();
  }

  function buildReportText() {
    const { userSkills, level, track, plan } = currentAnalysis;
    const score = computeScore(currentAnalysis);
    const lines = [
      `Career Goal: ${track.label}`,
      `Experience: ${level}`,
      `Skills: ${userSkills.join(", ")}`,
      `Readiness: ${score.finalScore}%`,
      `Study plan progress: ${weeksDone.size} / ${plan.length} periods`,
      "",
      "Skills Breakdown:",
      ...Array.from(document.querySelectorAll("#skillList .skill-tag")).map(t => `- ${t.textContent}`),
      "",
      "Priority Order:",
      ...(score.remaining.length
        ? score.remaining.map((s, i) => `${i + 1}. ${s}${resources[s] ? ` — ${resources[s][0].url}` : ""}`)
        : ["All core skills covered."]),
      "",
      `Roadmap (${level}):`,
      ...(track.roadmap[level] || []).map(s => `- ${s.title}: ${s.desc}`),
      "",
      `Open this plan: ${location.href}`
    ];
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
