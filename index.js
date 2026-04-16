const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

const updateThemeButton = () => {
  const isDark = root.classList.contains('dark');

  if (themeLabel) {
    themeLabel.textContent = isDark ? 'Claro' : 'Escuro';
  }

  if (sunIcon && moonIcon) {
    sunIcon.style.opacity = isDark ? '0' : '1';
    moonIcon.style.opacity = isDark ? '1' : '0';
  }
};

if (themeToggle) {
  updateThemeButton();

  themeToggle.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    updateThemeButton();
  });
}

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => observer.observe(element));

const skillItems = document.querySelectorAll('.skill-item');
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const item = entry.target;
    const bar = item.querySelector('.skill-bar');
    bar.style.width = `${item.dataset.progress}%`;
    skillsObserver.unobserve(item);
  });
}, { threshold: 0.4 });

skillItems.forEach((item) => skillsObserver.observe(item));

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = Number(counter.dataset.target);
    const duration = 1500;
    const startTime = performance.now();

    const updateCounter = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      counter.textContent = Math.floor(progress * target).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(updateCounter);
    };

    requestAnimationFrame(updateCounter);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));

const contactForm = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

if (contactForm && feedback) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const honeyField = contactForm.querySelector('input[name="_honey"]');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const mensagemInput = document.getElementById('mensagem');

  contactForm.addEventListener('submit', (event) => {
    const isHoneyFilled = honeyField && honeyField.value.trim() !== '';
    const nome = nomeInput ? nomeInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const mensagem = mensagemInput ? mensagemInput.value.trim() : '';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (isHoneyFilled || nome.length < 2 || !emailOk || mensagem.length < 20) {
      event.preventDefault();
      feedback.textContent = 'Não foi possível enviar. Revise os dados e tente novamente.';
      feedback.className = 'text-sm font-medium text-red-600';
      return;
    }

    feedback.textContent = 'Enviando mensagem...';
    feedback.className = 'text-sm font-medium text-slate-500';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('opacity-70', 'cursor-not-allowed');
    }
  });
}
