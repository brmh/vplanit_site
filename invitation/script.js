(function() {
  const qs = s => document.querySelector(s);
  const qsa = s => [...document.querySelectorAll(s)];
  
  // Modal elements
  const rsvpModal = qs('#rsvpModal');
  const successModal = qs('#successModal');
  const openRSVPBtn = qs('#openRSVP');
  const closeRSVPBtn = qs('#closeRSVP');
  const closeSuccessBtn = qs('#closeSuccess');
  
  // Form elements
  const rsvpForm = qs('#rsvpForm');
  const membersList = qs('#membersList');
  const tpl = qs('#memberTpl');
  const addBtn = qs('#addMember');
  const saveBtn = qs('#saveDraft');
  
  // Modal functions
  function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
  
  // Event listeners for modals
  openRSVPBtn.addEventListener('click', () => openModal(rsvpModal));
  closeRSVPBtn.addEventListener('click', () => closeModal(rsvpModal));
  closeSuccessBtn.addEventListener('click', () => closeModal(successModal));
  
  // Close modal when clicking outside
  rsvpModal.addEventListener('click', (e) => {
    if (e.target === rsvpModal) closeModal(rsvpModal);
  });
  
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) closeModal(successModal);
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (rsvpModal.classList.contains('show')) closeModal(rsvpModal);
      if (successModal.classList.contains('show')) closeModal(successModal);
    }
  });

  // Add member functionality
  function addMember(prefill) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    
    if (prefill) {
      node.querySelector('.m-name').value = prefill.name || '';
      // Set the appropriate radio button for age
      const ageRadio = node.querySelector(`input[value="${prefill.isAdult ? 'adult' : 'child'}"]`);
      if (ageRadio) ageRadio.checked = true;
      node.querySelector('.m-accom').checked = prefill.accommodation || false;
    }
    
    // Remove button functionality
    node.querySelector('.btn-remove').addEventListener('click', () => {
      if (membersList.children.length > 1) {
        node.remove();
      } else {
        showNotice('At least one guest is required', 'error');
      }
    });
    
    membersList.appendChild(node);
  }

  addBtn.addEventListener('click', () => addMember());
  
  // Add initial member if none exist
  if (membersList.children.length === 0) {
    addMember();
  }

  // Get form data
  function getData() {
    const evts = qsa('.evt:checked').map(i => i.value);
    const members = [...membersList.querySelectorAll('.member-card')].map(row => ({
      name: row.querySelector('.m-name').value.trim(),
      isAdult: row.querySelector('input[value="adult"]').checked,
      accommodation: row.querySelector('.m-accom').checked
    })).filter(m => m.name.length > 0);

    return {
      familyName: qs('#familyName').value.trim(),
      contactPhone: qs('#contactPhone').value.trim(),
      selectedEvents: evts,
      overall: {
        city: qs('#overallCity').value.trim(),
        date: qs('#overallDate').value,
        time: qs('#overallTime').value,
        transport: qs('#overallTransport').value
      },
      members
    };
  }

  // Validate form data
  function validate(data) {
    const errs = [];
    if (!data.familyName) errs.push('Family name is required');
    if (data.members.length === 0) errs.push('Add at least one guest');
    data.members.forEach((m, i) => {
      if (!m.name) errs.push(`Guest name missing in row ${i + 1}`);
    });
    return errs;
  }

  // Show notice
  function showNotice(message, type = 'info') {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)'};
      color: ${type === 'error' ? '#ff6b6b' : '#51cf66'};
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 3000;
      font-weight: 500;
      max-width: 300px;
      border: 1px solid ${type === 'error' ? '#ff6b6b' : '#51cf66'};
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Save draft
  function saveDraft() {
    const data = getData();
    const errs = validate(data);
    
    if (errs.length) {
      showNotice(errs.join(' • '), 'error');
      return;
    }
    
    localStorage.setItem('vplanit_rsvp', JSON.stringify(data));
    showNotice('Draft saved successfully!', 'success');
  }

  // Submit RSVP
  function submitRSVP(e) {
    e.preventDefault();
    
    const data = getData();
    const errs = validate(data);
    
    if (errs.length) {
      showNotice(errs.join(' • '), 'error');
      return;
    }
    
    // Save to localStorage (replace with API call later)
    localStorage.setItem('vplanit_rsvp', JSON.stringify(data));
    
    // Close RSVP modal and show success
    closeModal(rsvpModal);
    openModal(successModal);
    
    // Reset form (except pre-filled family details)
    qs('#overallCity').value = '';
    qs('#overallDate').value = '';
    qs('#overallTime').value = '';
    qs('#overallTransport').value = '';
    
    // Reset events to defaults
    qsa('.evt').forEach(e => {
      e.checked = e.value === 'Haldi' || e.value === 'Wedding';
    });
    
    // Reset members
    membersList.innerHTML = '';
    addMember();
  }

  // Event listeners
  saveBtn.addEventListener('click', saveDraft);
  rsvpForm.addEventListener('submit', submitRSVP);

  // Load draft if present
  const cached = localStorage.getItem('vplanit_rsvp');
  if (cached) {
    try {
      const d = JSON.parse(cached);
      
      // Events
      qsa('.evt').forEach(e => {
        e.checked = (d.selectedEvents || []).includes(e.value);
      });
      
      // Overall
      qs('#overallCity').value = d.overall?.city || '';
      qs('#overallDate').value = d.overall?.date || '';
      qs('#overallTime').value = d.overall?.time || '';
      qs('#overallTransport').value = d.overall?.transport || '';
      
      // Members
      membersList.innerHTML = '';
      (d.members || []).forEach(m => addMember(m));
      
      showNotice('Draft loaded from previous session', 'success');
    } catch (e) {
      console.error('Error loading cached data:', e);
    }
  }

  // Add some visual feedback for form interactions
  qsa('input, select').forEach(el => {
    if (!el.disabled) {
      el.addEventListener('focus', () => {
        el.parentElement.style.transform = 'scale(1.02)';
        el.parentElement.style.transition = 'transform 0.2s ease';
      });
      
      el.addEventListener('blur', () => {
        el.parentElement.style.transform = 'scale(1)';
      });
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          saveDraft();
          break;
      }
    }
  });

  // Show keyboard shortcuts hint
  setTimeout(() => {
    if (!localStorage.getItem('vplanit_rsvp')) {
      showNotice('💡 Tip: Use Ctrl+S to save draft', 'info');
    }
  }, 2000);

  // Add some elegance to the invitation card
  const invitationCard = qs('.invitation-card');
  if (invitationCard) {
    invitationCard.addEventListener('mouseenter', () => {
      invitationCard.style.transform = 'translateY(-5px)';
      invitationCard.style.transition = 'transform 0.3s ease';
    });
    
    invitationCard.addEventListener('mouseleave', () => {
      invitationCard.style.transform = 'translateY(0)';
    });
  }

  // Smooth reveal animation for invitation elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe invitation elements
  const invitationElements = qsa('.couple-names, .wedding-text, .rsvp-section');
  invitationElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add some sparkle to the ornaments
  const ornaments = qsa('.ornament');
  ornaments.forEach((ornament, index) => {
    ornament.style.animationDelay = `${index * 0.2}s`;
    ornament.style.animation = 'sparkle 2s ease-in-out infinite';
  });

  // Add sparkle animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkle {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);

})();
