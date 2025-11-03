// Emergency Contact System Management

class EmergencyContactSystem {
    constructor() {
        // Keep track of current campus
        this.currentCampus = null;
        
        this.contacts = {
            'PNP': {
                name: 'Philippine National Police',
                number: '117',
                category: 'Police'
            },
            'BFP': {
                name: 'Bureau of Fire Protection',
                number: '160',
                category: 'Fire'
            },
            'NDRRMC': {
                name: 'National Disaster Risk Reduction and Management Council',
                number: '911',
                category: 'Disaster'
            },
            'Red Cross': {
                name: 'Philippine Red Cross',
                number: '143',
                category: 'Emergency Medical'
            },
            'MMDA': {
                name: 'Metro Manila Development Authority',
                number: '136',
                category: 'Traffic & Flood Control'
            }
        };

        this.campusContacts = {
            'dlsu': {
                name: 'De La Salle University',
                security: '524-4611 loc 100',
                clinic: '524-4611 loc 200',
                facilities: '524-4611 loc 300'
            },
            'ust': {
                name: 'University of Santo Tomas',
                security: '731-3100 loc 8201',
                clinic: '731-3100 loc 8251',
                facilities: '731-3100 loc 8301'
            },
            'up': {
                name: 'University of the Philippines',
                security: '981-8500 loc 4008',
                clinic: '981-8500 loc 2702',
                facilities: '981-8500 loc 2743'
            },
            'mapua-makati': {
                name: 'Mapua Makati',
                security: '(02) 8845-7272 loc 8201',
                clinic: '(02) 8845-7272 loc 8301',
                facilities: '(02) 8845-7272 loc 8401'
            },
            'mapua-intramuros': {
                name: 'Mapua Intramuros',
                security: '(02) 8247-5000 loc 1101',
                clinic: '(02) 8247-5000 loc 1201',
                facilities: '(02) 8247-5000 loc 1301'
            }
        };
    }

    // Set current campus
    setCurrentCampus(campusId) {
        this.currentCampus = campusId;
        this.displayEmergencyContacts();
    }

    displayEmergencyContacts() {
        const contactsContainer = document.getElementById('contactsContent');
        if (!contactsContainer) return;

        let html = `
            <div class="contacts-section">
                <h4><i class="fas fa-phone-alt"></i> National Emergency Numbers</h4>
                <div class="contacts-grid">
        `;

        // Add national emergency contacts
        for (const [id, contact] of Object.entries(this.contacts)) {
            html += `
                <div class="contact-card">
                    <div class="contact-header ${contact.category.toLowerCase()}">
                        <i class="fas fa-${this.getCategoryIcon(contact.category)}"></i>
                        <span>${contact.name}</span>
                    </div>
                    <div class="contact-number">
                        <a href="tel:${contact.number}">${contact.number}</a>
                    </div>
                    <div class="contact-category">${contact.category}</div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
            <div class="contacts-section">
                <h4><i class="fas fa-university"></i> Campus Emergency Contacts</h4>
                <div class="campus-contacts">
        `;

        // Add campus-specific contacts based on current selection
        if (this.currentCampus && this.campusContacts[this.currentCampus]) {
            const campus = this.campusContacts[this.currentCampus];
            html += `
                <div class="campus-contact-card">
                    <h5>${campus.name}</h5>
                    <div class="campus-numbers">
                        <div class="campus-number">
                            <i class="fas fa-shield-alt"></i>
                            <span>Security: <a href="tel:${campus.security}">${campus.security}</a></span>
                        </div>
                        <div class="campus-number">
                            <i class="fas fa-first-aid"></i>
                            <span>Clinic: <a href="tel:${campus.clinic}">${campus.clinic}</a></span>
                        </div>
                        <div class="campus-number">
                            <i class="fas fa-tools"></i>
                            <span>Facilities: <a href="tel:${campus.facilities}">${campus.facilities}</a></span>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
            <div class="contacts-tips">
                <h4><i class="fas fa-info-circle"></i> Emergency Contact Tips</h4>
                <ul>
                    <li>Save these numbers on your phone for quick access</li>
                    <li>When calling, stay calm and provide clear information</li>
                    <li>Know your exact location within the campus</li>
                    <li>Follow emergency protocols and instructions</li>
                </ul>
            </div>
        `;

        contactsContainer.innerHTML = html;
    }

    getCategoryIcon(category) {
        const icons = {
            'Police': 'shield',
            'Fire': 'fire',
            'Disaster': 'exclamation-triangle',
            'Emergency Medical': 'ambulance',
            'Traffic & Flood Control': 'traffic-light'
        };
        return icons[category] || 'phone';
    }
}

// Initialize emergency contacts
document.addEventListener('DOMContentLoaded', () => {
    window.emergencySystem = new EmergencyContactSystem();
    window.emergencySystem.displayEmergencyContacts();
});