import { sendContactMessage } from '../../services/contact.service';

// Bilingual markup for JS-rendered strings: CSS (html[lang]) shows the active language,
// so these keep working after the user toggles the language.
const bi = (es, en) => `<span data-lang="es">${es}</span><span data-lang="en">${en}</span>`;

// Typing effect texts (only active if an element with id="typing-text" exists)
const typingTexts = {
    es: ['Ingeniero en Sistemas', 'Analista de Sistemas', 'Desarrollador Full Stack', 'Desarrollador Web', 'Desarrollador de Software'],
    en: ['Systems Engineer', 'Systems Analyst', 'Full Stack Developer', 'Web Developer', 'Software Developer'],
};

function init() {
    initializeTypingEffect();
    initializeContactForm();
    initializeCopyButtons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

const currentLang = () => (document.documentElement.lang === 'en' ? 'en' : 'es');

function initializeTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer;

    function typeText() {
        const currentText = typingTexts[currentLang()][textIndex];

        if (!isDeleting) {
            typingElement.textContent = currentText.substring(0, ++charIndex);
            if (charIndex === currentText.length) {
                isDeleting = true;
                timer = setTimeout(typeText, 2000);
                return;
            }
        } else {
            typingElement.textContent = currentText.substring(0, --charIndex);
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingTexts.es.length;
            }
        }
        timer = setTimeout(typeText, isDeleting ? 50 : 100);
    }

    // restart in the new language
    document.addEventListener('languagechange', () => {
        clearTimeout(timer);
        textIndex = 0;
        charIndex = 0;
        isDeleting = false;
        typeText();
    });

    typeText();
}

// Copy buttons (email / phone)
function initializeCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(button => {
        const icon = button.querySelector('i');
        const status = button.parentElement.querySelector('[data-copy-status]');
        let timer;

        button.addEventListener('click', async () => {
            if (!(await copyText(button.dataset.copy))) return;
            icon.className = 'fas fa-check';
            status.innerHTML = bi('¡Copiado!', 'Copied!');
            clearTimeout(timer);
            timer = setTimeout(() => {
                icon.className = 'far fa-copy';
                status.innerHTML = '';
            }, 1500);
        });
    });
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // fallback for insecure contexts
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch {}
        area.remove();
        return ok;
    }
}

// Contact form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('cf-submit');
    const feedback = document.getElementById('cf-feedback');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const payload = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            subject: form.querySelector('[name="subject"]').value,
            message: form.querySelector('[name="message"]').value,
        };

        setSubmitting(true);
        hideFeedback();

        try {
            const data = await sendContactMessage(payload);

            if (data.success) {
                showFeedback('success', '<i class="fas fa-check-circle mr-2"></i>' + bi('¡Mensaje enviado! Te respondo a la brevedad.', "Message sent! I'll get back to you soon."));
                form.reset();
            } else {
                showFeedback('error', '<i class="fas fa-exclamation-circle mr-2"></i>' + (data.message || bi('Error al enviar. Intentá nuevamente.', 'Could not send. Please try again.')));
            }
        } catch {
            showFeedback('error', '<i class="fas fa-exclamation-circle mr-2"></i>' + bi('Error de conexión. Intentá nuevamente.', 'Connection error. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    });

    function setSubmitting(loading) {
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading
            ? '<i class="fas fa-spinner fa-spin mr-2"></i>' + bi('Enviando...', 'Sending...')
            : '<i class="fas fa-paper-plane mr-2"></i>' + bi('Enviar mensaje', 'Send message');
    }

    function showFeedback(type, html) {
        feedback.innerHTML = html;
        feedback.className = type === 'success'
            ? 'text-sm font-medium px-4 py-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
            : 'text-sm font-medium px-4 py-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
    }

    function hideFeedback() {
        feedback.className = 'hidden';
        feedback.innerHTML = '';
    }
}
