(function () {
    'use strict';

    // Footer year
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Navbar: border on scroll + mobile menu
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 10); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function closeMenu() {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });

    // Highlight active section link
    var sections = document.querySelectorAll('main section[id]');
    var anchors = {};
    links.querySelectorAll('a[href^="#"]').forEach(function (a) { anchors[a.getAttribute('href').slice(1)] = a; });
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting && anchors[en.target.id]) {
                    Object.values(anchors).forEach(function (a) { a.classList.remove('active'); });
                    anchors[en.target.id].classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { spy.observe(s); });

        // Scroll reveal
        var targets = document.querySelectorAll('.card, .job, .stat, .prose, h2, .kicker');
        targets.forEach(function (el) { el.classList.add('reveal'); });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.08 });
        targets.forEach(function (el) { io.observe(el); });
    }

    // Contact form
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    var btn = document.getElementById('sendBtn');

    function say(msg, ok) {
        status.textContent = msg;
        status.className = ok ? 'ok' : 'err';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = new FormData(form);
        var email = String(data.get('email') || '').trim();
        if (!String(data.get('name') || '').trim() || !String(data.get('message') || '').trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            say('Please fill in all fields with a valid email.', false);
            return;
        }
        btn.disabled = true;
        btn.textContent = 'Sending...';
        fetch('/send_message', { method: 'POST', body: data })
            .then(function (r) { return r.json(); })
            .then(function (res) {
                if (res.status === 'success') {
                    say('Thanks! Your message was sent. I will get back to you soon.', true);
                    form.reset();
                } else {
                    say(res.message || 'Could not send the message. Please email me directly at jawadahmad.swe@gmail.com.', false);
                }
            })
            .catch(function () {
                say('Network error. Please email me directly at jawadahmad.swe@gmail.com.', false);
            })
            .finally(function () {
                btn.disabled = false;
                btn.textContent = 'Send message';
            });
    });
})();
