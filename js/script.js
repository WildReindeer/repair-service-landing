// Main application
class RepairServiceApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setupFormValidation();
  }

  setupEventListeners() {
    // Call master button
    const callMasterBtn = document.getElementById('callMasterBtn');
    if (callMasterBtn) {
      callMasterBtn.addEventListener('click', () => {
        this.scrollToSection('contact');
      });
    }

    // Form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Clear form button
    const clearFormBtn = document.getElementById('clearFormBtn');
    if (clearFormBtn) {
      clearFormBtn.addEventListener('click', () => this.clearForm());
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.benefit-card, .service-card').forEach(el => {
      observer.observe(el);
    });
  }

  setupFormValidation() {
    const contactInput = document.getElementById('contact');
    if (contactInput) {
      contactInput.addEventListener('input', (e) => {
        this.validateContactField(e.target);
      });
    }

    const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        this.validateNameField(e.target);
      });
    }
  }

  validateNameField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('nameError');
    
    if (value.length < 2) {
      this.showFieldError(field, errorElement, 'Имя должно содержать минимум 2 символа');
      return false;
    } else {
      this.clearFieldError(field, errorElement);
      return true;
    }
  }

  validateContactField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('contactError');
    
    if (!this.isValidContact(value)) {
      this.showFieldError(field, errorElement, 'Введите корректный email или телефон');
      return false;
    } else {
      this.clearFieldError(field, errorElement);
      return true;
    }
  }

  isValidContact(contact) {
    const phoneRegex = /^[\+]?[7-8]?[0-9\s\-\(\)]{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneRegex.test(contact) || emailRegex.test(contact);
  }

  showFieldError(field, errorElement, message) {
    field.style.borderColor = '#e53e3e';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  clearFieldError(field, errorElement) {
    field.style.borderColor = '';
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const formMessage = document.getElementById('formMessage');

    // Validate fields
    const isNameValid = this.validateNameField(document.getElementById('name'));
    const isContactValid = this.validateContactField(document.getElementById('contact'));

    if (!isNameValid || !isContactValid) {
      this.showMessage('Пожалуйста, исправьте ошибки в форме', 'error', formMessage);
      return;
    }

    // Simulate form submission
    try {
      this.showMessage('Отправка заявки...', 'info', formMessage);
      
      // In a real application, you would send data to the server here
      await this.simulateApiCall(formData);
      
      this.showMessage('Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.', 'success', formMessage);
      this.clearForm();
      
      // Track conversion (for analytics)
      this.trackConversion('form_submission');
      
    } catch (error) {
      this.showMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или позвоните нам.', 'error', formMessage);
    }
  }

  simulateApiCall(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form data would be sent:', Object.fromEntries(formData));
        resolve({ success: true });
      }, 1500);
    });
  }

  showMessage(text, type, element) {
    element.textContent = text;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000);
    }
  }

  clearForm() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.reset();
      
      // Clear error messages
      document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
      });
      
      // Clear form message
      const formMessage = document.getElementById('formMessage');
      if (formMessage) {
        formMessage.style.display = 'none';
      }
      
      // Reset field borders
      document.querySelectorAll('.form-input, .form-textarea').forEach(field => {
        field.style.borderColor = '';
      });
    }
  }

  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  trackConversion(event) {
    // In a real application, you would send this to analytics
    console.log(`Conversion tracked: ${event}`, {
      timestamp: new Date().toISOString(),
      event: event
    });
  }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .benefit-card, .service-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .benefit-card.animate-in, .service-card.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .benefit-card, .service-card {
      transition: none;
      opacity: 1;
      transform: none;
    }
  }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new RepairServiceApp();
});

// Add loading state management
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});