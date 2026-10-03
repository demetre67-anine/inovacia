/**
 * ქართული Landing Page — Vanilla JavaScript
 * ფუნქციონალი: ჰამბურგერ მენიუ, სექციებზე Smooth Scroll, ფორმის ვალიდაცია
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. ელემენტების ინიციალიზაცია
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const siteHeader = document.getElementById('siteHeader');
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userMessageInput = document.getElementById('userMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formAlert = document.getElementById('formAlert');
  const submitButton = document.getElementById('submitButton');

  // ==========================================
  // 2. ჰამბურგერ მენიუს ლოგიკა (Mobile Menu)
  // ==========================================
  function toggleMobileMenu() {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა');
  }

  function closeMobileMenu() {
    if (mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'მენიუს გახსნა');
    }
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // მენიუს დახურვა გარეთ დაკლიკებისას
    document.addEventListener('click', (e) => {
      if (!siteHeader.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Escape ღილაკით დახურვა
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // ეკრანის გაფართოებისას მენიუს დახურვა
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================
  // 3. Smooth Scroll და აქტიური ბმულის კონტროლი
  // ==========================================
  const scrollAnchors = document.querySelectorAll('a[href^="#"]');

  scrollAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        closeMobileMenu();

        const headerOffset = siteHeader ? siteHeader.offsetHeight : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // URL ჰეშის განახლება ისტორიაში
        history.pushState(null, '', targetId);
      }
    });
  });

  // ჰედერზე ჩრდილის დამატება სქროლისას
  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // სექციების აქტიური მდგომარეობის მონიტორინგი სქროლის დროს
  const observedSections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && observedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    observedSections.forEach((sec) => sectionObserver.observe(sec));
  }

  // ==========================================
  // 4. საკონტაქტო ფორმის ვალიდაცია
  // ==========================================

  // ელფოსტის ვალიდაციის რეგულარული გამოსახულება
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // კონკრეტული ველის შეცდომის ჩვენება
  function setFieldError(inputElement, errorElement, message) {
    inputElement.classList.add('input-error');
    errorElement.textContent = message;
  }

  // ველის შეცდომის გასუფთავება
  function clearFieldError(inputElement, errorElement) {
    inputElement.classList.remove('input-error');
    errorElement.textContent = '';
  }

  // მთლიანი ფორმის ალერტის ჩვენება
  function showFormAlert(type, message) {
    formAlert.className = `form-alert ${type}`;
    formAlert.textContent = message;
    formAlert.style.display = 'block';
  }

  // ალერტის დამალვა
  function hideFormAlert() {
    formAlert.className = 'form-alert';
    formAlert.textContent = '';
    formAlert.style.display = 'none';
  }

  // სახელის ვალიდაცია
  function validateName() {
    const val = userNameInput.value.trim();
    if (val === '') {
      setFieldError(userNameInput, nameError, 'გთხოვთ, მიუთითოთ სახელი.');
      return false;
    } else if (val.length < 2) {
      setFieldError(userNameInput, nameError, 'სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან.');
      return false;
    }
    clearFieldError(userNameInput, nameError);
    return true;
  }

  // ელფოსტის ვალიდაცია
  function validateEmail() {
    const val = userEmailInput.value.trim();
    if (val === '') {
      setFieldError(userEmailInput, emailError, 'გთხოვთ, მიუთითოთ ელფოსტა.');
      return false;
    } else if (!isValidEmail(val)) {
      setFieldError(userEmailInput, emailError, 'გთხოვთ, მიუთითოთ ვალიდური ელფოსტის მისამართი.');
      return false;
    }
    clearFieldError(userEmailInput, emailError);
    return true;
  }

  // შეტყობინების ვალიდაცია
  function validateMessage() {
    const val = userMessageInput.value.trim();
    if (val === '') {
      setFieldError(userMessageInput, messageError, 'გთხოვთ, დაწეროთ შეტყობინება.');
      return false;
    } else if (val.length < 10) {
      setFieldError(userMessageInput, messageError, 'შეტყობინება უნდა შედგებოდეს მინიმუმ 10 სიმბოლოსგან.');
      return false;
    }
    clearFieldError(userMessageInput, messageError);
    return true;
  }

  // ინტერაქტიული გასუფთავება მომხმარებლის მიერ წერისას
  if (userNameInput) {
    userNameInput.addEventListener('input', () => {
      if (userNameInput.classList.contains('input-error')) {
        validateName();
      }
    });
  }

  if (userEmailInput) {
    userEmailInput.addEventListener('input', () => {
      if (userEmailInput.classList.contains('input-error')) {
        validateEmail();
      }
    });
  }

  if (userMessageInput) {
    userMessageInput.addEventListener('input', () => {
      if (userMessageInput.classList.contains('input-error')) {
        validateMessage();
      }
    });
  }

  // ფორმის გაგზავნის დამუშავება
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideFormAlert();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      // თუ რომელიმე ველი არავალიდურია
      if (!isNameValid || !isEmailValid || !isMessageValid) {
        showFormAlert('error', 'გთხოვთ, სწორად შეავსოთ მითითებული ველები.');
        
        // პირველივე შეცდომიან ველზე ფოკუსირება
        if (!isNameValid) {
          userNameInput.focus();
        } else if (!isEmailValid) {
          userEmailInput.focus();
        } else if (!isMessageValid) {
          userMessageInput.focus();
        }
        return;
      }

      // წარმატებული გაგზავნის სიმულაცია
      const originalButtonText = submitButton.querySelector('.btn-text').textContent;
      submitButton.disabled = true;
      submitButton.querySelector('.btn-text').textContent = 'იგზავნება...';

      setTimeout(() => {
        // წარმატების შეტყობინების ჩვენება
        showFormAlert('success', 'თქვენი შეტყობინება წარმატებით გაიგზავნა!');

        // ფორმის გასუფთავება
        contactForm.reset();
        clearFieldError(userNameInput, nameError);
        clearFieldError(userEmailInput, emailError);
        clearFieldError(userMessageInput, messageError);

        // ღილაკის პირვანდელი სახის დაბრუნება
        submitButton.disabled = false;
        submitButton.querySelector('.btn-text').textContent = originalButtonText;

        // წარმატების შეტყობინების ავტომატური დამალვა 6 წამის შემდეგ
        setTimeout(() => {
          hideFormAlert();
        }, 6000);
      }, 700);
    });
  }
});
