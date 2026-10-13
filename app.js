/* =====================================================
   AISWARYA K S — CYBER FORENSICS & SECURITY PORTFOLIO
   Interactive Engine: Theme, Terminal CLI, THM Filter,
   Forensics Workbench, Scroll Tracking & Toasts
   ===================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initNavbar();
  initMobileNav();
  initHeroStation();
  initHeroTerminal();
  initThmFilter();
  initForensicWorkbench();
  initContactForm();
  setFooterYear();
});

/* ── 1. Theme Toggle (Dark / Light) ────────────────── */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  if (!toggleBtn || !themeIcon) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    themeIcon.textContent = nextTheme === 'light' ? '🌙' : '☀️';
    showToast(`Switched to ${nextTheme === 'light' ? 'Light Editorial' : 'Cyber Dark'} Mode`);
  });
}

/* ── 2. Top Scroll Progress Indicator ──────────────── */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ── 3. Navbar Scroll & Active Section Highlighting ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => observer.observe(sec));
}

/* ── 4. Mobile Navigation Drawer ───────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('navMenu');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── 5. Hero Station Tabs ──────────────────────────── */
function initHeroStation() {
  const tabBtns = document.querySelectorAll('.station-tab-btn');
  const contents = document.querySelectorAll('.station-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      contents.forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetId = `stationTab-${btn.dataset.tab}`;
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'flex';
      }
    });
  });
}

/* ── 6. Interactive Hero Terminal CLI ──────────────── */
function initHeroTerminal() {
  const input = document.getElementById('heroTermInput');
  const logs = document.getElementById('heroTerminalLogs');
  const quickBtns = document.querySelectorAll('.term-qbtn');

  if (!input || !logs) return;

  const commands = {
    help: () => `Available commands:
  • webpent      : Web App vulnerability scanner details
  • apisec       : OpenAPI & REST security auditor details
  • whoami       : About Aiswarya K S
  • education    : Degree & University details
  • thm          : TryHackMe profile info
  • forensics    : Forensic toolset & focus
  • skills       : Core security proficiencies
  • projects     : Featured project list
  • contact      : Contact & social links
  • clear        : Reset terminal screen`,

    apisec: () => `[+] Tool: apisec-audit (OpenAPI & REST Security Auditor)
Author: Aiswarya K S
Standard: OWASP API Security Top 10 (2023)
Checks:
  • API2 Auth    : Missing security schemes, API keys in query, Basic auth
  • API3 Data    : Sensitive response schemas & mass assignment properties
  • API4 Limits  : Rate-limiting definitions & HTTP 429 status
  • API7 Config  : Unencrypted HTTP servers & TLS misconfigurations
  • API9 Inven.  : Deprecated endpoints & unversioned paths
Usage:
  python -m apisec sample_spec.json --md audit.md --fail-on high
Repo: https://github.com/AiswaryaKS-aysho/apisec-audit`,

    webpent: () => `[+] Tool: webpent (Web App Pentest & Vulnerability Scanner)
Author: Aiswarya K S
Probes:
  • XSS       : Injected canary reflection detection
  • SQLi      : Error-based regex & Boolean-divergence analysis
  • SSRF      : Canary callbacks, metadata (169.254.169.254) & loopback
  • Redirect  : 3xx Location header validation
  • Headers   : HSTS, CSP, XFO, nosniff, cookie flags audit
Usage:
  python -m webpent "https://target/search?q=test" --probes all -o report
  python -m webpent "https://target/login" -d "user=admin" --proxy http://127.0.0.1:8080
Reports: JSON + Markdown generated | Exit code 1 on findings (CI ready)`,

    whoami: () => `Aiswarya K S
Role: Junior Cybersecurity & Cyber Forensics Student
Location: Thrissur, Kerala, India
Focus: Web AppSec (webpent), memory forensics, packet analysis, incident triage`,

    education: () => `Degree: Bachelor of Science in Cyber Forensics (BSc)
Institution: Mahatma Gandhi University (MGU)
Timeline: 2023 – 2026 (Undergraduate)`,

    thm: () => `TryHackMe Profile: @aiswaryaks325
URL: https://tryhackme.com/p/aiswaryaks325
Primary Tracks: Digital Forensics, Pre-Security, SOC Level 1, Linux CLI`,

    forensics: () => `Active Forensic Investigation Toolkit:
  • Volatility 3 : Memory snapshot analysis & rogue process triage
  • Wireshark    : Network traffic dissection & DNS anomaly tracking
  • Autopsy      : File system recovery, timeline & metadata carving
  • FTK Imager   : Raw disk image acquisition & SHA-256 verification`,

    skills: () => `Technical Matrix:
  • Digital Forensics: Volatility 3, Autopsy, FTK Imager, ExifTool
  • Network Security: Wireshark, Nmap, TCP/IP, Suricata basics
  • Systems: Linux (Debian/Ubuntu), Bash, Git, Python 3`,

    projects: () => `Featured Hands-On Projects:
  1. webpent — Web App Pentest & Vulnerability Scanner (Flagship Python CLI)
  2. Python Packet Sniffer & Intrusion Alert Script (Scapy)
  3. Evidence Hash & Chain of Custody Verifier (SHA-256)
  4. Memory Dump Malware Triage Lab (Volatility 3)
  5. Snort/Suricata Home Lab NIDS Rule Writing`,

    contact: () => `Connect with Aiswarya:
  • LinkedIn: linkedin.com/in/aiswarya-k-s-
  • GitHub: github.com/AiswaryaKS-aysho
  • TryHackMe: tryhackme.com/p/aiswaryaks325
  • Location: Thrissur, Kerala, India`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      logs.innerHTML = '';
      return;
    }

    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line';
    cmdLine.innerHTML = `<div class="term-cmd">${escapeHtml(cmd)}</div>`;
    logs.appendChild(cmdLine);

    const outLine = document.createElement('div');
    outLine.className = 'term-line';

    if (commands[cmd]) {
      const outputText = commands[cmd]();
      outLine.innerHTML = `<div class="term-out">${escapeHtml(outputText).replace(/\n/g, '<br>')}</div>`;
    } else {
      outLine.innerHTML = `<div class="term-out" style="color:var(--accent-rose);">Command not recognized: '${escapeHtml(cmd)}'. Type <span style="color:var(--accent-cyan);">'help'</span> for a list of commands.</div>`;
    }

    logs.appendChild(outLine);
    logs.scrollTop = logs.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
      input.value = '';
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      executeCommand(cmd);
      if (input) input.focus();
    });
  });
}

/* ── 7. TryHackMe Rooms Filter & Link Copier ───────── */
function initThmFilter() {
  const filterBtns = document.querySelectorAll('.filter-pill[data-thm-filter]');
  const roomCards = document.querySelectorAll('.thm-room-card');
  const copyBtn = document.getElementById('btnCopyThmLink');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.thmFilter;
      roomCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = 'https://tryhackme.com/p/aiswaryaks325';
      navigator.clipboard.writeText(url).then(() => {
        showToast('Copied TryHackMe link to clipboard!');
      }).catch(() => {
        showToast('Link: ' + url);
      });
    });
  }
}

/* ── 8. Forensic Lab Interactive Workbench ─────────── */
function initForensicWorkbench() {
  const tabBtns = document.querySelectorAll('.wb-tab-btn');
  const panels = document.querySelectorAll('.wb-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panelId = `wbPanel-${btn.dataset.wb}`;
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Action Buttons
  const memoryOutput = document.getElementById('wbOutput-memory');
  document.querySelectorAll('[data-action="run-pslist"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (memoryOutput) {
        memoryOutput.textContent = `[+] Executing Volatility 3: windows.pslist on incident_case_042.raw...
PID    PPID   ImageFileName       Offset(V)          Threads  Handles  SessionId  Wow64
4      0      System              0xfa8001a14040     118      528      N/A        False
392    4      smss.exe            0xfa80029b3060     2        32       N/A        False
512    504    csrss.exe           0xfa8003180b00     11       640      0          False
620    504    wininit.exe         0xfa80032cb060     3        82       0          False
688    620    services.exe        0xfa80032f3060     9        214      0          False
704    620    lsass.exe           0xfa80032fb060     7        581      0          False
1048   688    svchost.exe         0xfa8003884b00     14       312      0          False
[!] 4120   1048   cmd.exe             0xfa8004b77060     1        24       0          False  <-- SUSPICIOUS SPAWN
[!] 4288   4120   powershell.exe      0xfa8004ce9b00     8        190      0          False  <-- RUNNING ENCODED SCRIPT`;
        showToast('Volatility windows.pslist executed');
      }
    });
  });

  document.querySelectorAll('[data-action="run-netscan"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (memoryOutput) {
        memoryOutput.textContent = `[+] Executing Volatility 3: windows.netscan on incident_case_042.raw...
Offset          Proto  Local Address          Foreign Address        State       PID    Owner
0xfa8003884b00  TCPv4  192.168.1.105:49152    198.51.100.44:443      ESTABLISHED 4288   powershell.exe [!]
0xfa80032fb060  TCPv4  0.0.0.0:445            0.0.0.0:0              LISTENING   4      System
0xfa80032cb060  TCPv4  0.0.0.0:135            0.0.0.0:0              LISTENING   688    svchost.exe
[!] ALERT: powershell.exe (PID 4288) maintaining active encrypted socket to unknown external IP 198.51.100.44`;
        showToast('Volatility windows.netscan completed: Rogue socket detected');
      }
    });
  });

  const pcapOutput = document.getElementById('wbOutput-pcap');
  document.querySelectorAll('[data-action="analyze-pcap"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (pcapOutput) {
        pcapOutput.textContent = `[+] Wireshark Triage: Display filter applied: dns.qry.name contains "exfil"
Frame 14: 128 bytes on wire (1024 bits), 128 bytes captured
Ethernet II, Src: 00:1a:2b:3c:4d:5e, Dst: 00:0c:29:ab:cd:ef
Internet Protocol Version 4, Src: 192.168.1.105, Dst: 198.51.100.44
User Datagram Protocol, Src Port: 53120, Dst Port: 53
Domain Name System (query)
    Queries
        Zm9yZW5zaWNzX2RhdGE.exfil-dns.xyz: type A, class IN
[!] Decoded Base64 Payload chunk: 'forensics_data'
[✓] Finding: Confirmed covert DNS tunneling exfiltration vector.`;
        showToast('Wireshark filter applied: DNS Exfiltration identified');
      }
    });
  });

  const hashOutput = document.getElementById('wbOutput-hash');
  document.querySelectorAll('[data-action="verify-hash"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (hashOutput) {
        hashOutput.textContent = `[*] Calculating SHA-256 for evidence_usb_image.dd (Size: 4,294,967,296 bytes)...
[+] Block 1/4096 ... Block 4096/4096 [Complete]
[*] Calculated SHA-256 : e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
[*] Logged SHA-256     : e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
[✓] RESULT: 100% MATCH. Evidence integrity preserved per ISO/IEC 27037 standards.`;
        showToast('SHA-256 hash verified: Evidence integrity 100%');
      }
    });
  });

  const logsOutput = document.getElementById('wbOutput-logs');
  document.querySelectorAll('[data-action="filter-failed-ssh"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (logsOutput) {
        logsOutput.textContent = `[+] Command: grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr
   2,412 203.0.113.88
     128 198.51.100.12
      14 192.0.2.45
[!] Top Offender: 203.0.113.88 with 2,412 failed SSH attempts in 10 minutes.
[✓] Mitigation: Subnet blacklisted via fail2ban jail and iptables DROP.`;
        showToast('Auth.log triage complete: Brute-force IP isolated');
      }
    });
  });
}

/* ── 9. Contact Form Simulation ────────────────────── */
function initContactForm() {
  window.handleContactSubmit = () => {
    const name = document.getElementById('contactName').value;
    showToast(`Thank you, ${name}! Your message has been logged.`);
    document.getElementById('contactForm').reset();
  };
}

/* ── 10. Toast Notification System ─────────────────── */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ── 11. Footer Year ───────────────────────────────── */
function setFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ── Helper: Escape HTML ───────────────────────────── */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
