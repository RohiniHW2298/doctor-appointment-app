// Mock Database Data
const SPECIALTIES = [
    { id: 1, name: 'Cardiology', icon: 'fa-heart-pulse', color: 'text-red-500', bg: 'bg-red-100' },
    { id: 2, name: 'Neurology', icon: 'fa-brain', color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 3, name: 'Pediatrics', icon: 'fa-baby', color: 'text-pink-500', bg: 'bg-pink-100' },
    { id: 4, name: 'Dentistry', icon: 'fa-tooth', color: 'text-teal-500', bg: 'bg-teal-100' },
    { id: 5, name: 'Orthopedics', icon: 'fa-bone', color: 'text-orange-500', bg: 'bg-orange-100' },
    { id: 6, name: 'Ophthalmology',icon: 'fa-eye', color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { id: 7, name: 'Dermatology', icon: 'fa-allergies', color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 8, name: 'General', icon: 'fa-stethoscope', color: 'text-emerald-500', bg: 'bg-emerald-100' },
];

const DOCTORS = [
    { id: 1, name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', rating: 4.9, reviews: 124, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces&q=80', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', rating: 4.8, reviews: 98, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces&q=80', available: true },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', rating: 5.0, reviews: 215, image: 'https://images.unsplash.com/photo-1594824436998-ef228b3cf031?w=400&h=400&fit=crop&crop=faces&q=80', available: false },
    { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedics', rating: 4.7, reviews: 86, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=faces&q=80', available: true },
    { id: 5, name: 'Dr. Anita Patel', specialty: 'Dermatology', rating: 4.9, reviews: 156, image: 'https://images.unsplash.com/photo-1527613426401-41d3101447d0?w=400&h=400&fit=crop&crop=faces&q=80', available: true },
    { id: 6, name: 'Dr. Robert Taylor', specialty: 'General', rating: 4.6, reviews: 204, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=faces&q=80', available: true },
];

let appointments = JSON.parse(localStorage.getItem('mediconnect_appointments')) || [];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    renderSpecialties();
    renderDoctors(DOCTORS);
    renderAppointments();
    populateSpecialtyDropdown();
    
    // Setup date input min value to today
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Add scroll event for navbar styling
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 20) {
            nav.classList.add('shadow-md');
            nav.classList.replace('glass', 'bg-white/95');
        } else {
            nav.classList.remove('shadow-md');
            nav.classList.replace('bg-white/95', 'glass');
        }
    });

    // Setup Search Enter Key
    document.getElementById('searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') filterDoctors();
    });
});

// Render Functions
function renderSpecialties() {
    const grid = document.getElementById('specialtiesGrid');
    grid.innerHTML = SPECIALTIES.map(s => `
        <div class="bg-white p-6 rounded-2xl border border-slate-100 hover-scale cursor-pointer text-center group" onclick="filterBySpecialty('${s.name}')">
            <div class="w-16 h-16 mx-auto rounded-2xl ${s.bg} flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                <i class="fa-solid ${s.icon} ${s.color} text-2xl group-hover:text-white transition-colors duration-300"></i>
            </div>
            <h3 class="font-bold text-slate-800">${s.name}</h3>
        </div>
    `).join('');
}

function renderDoctors(docs) {
    const grid = document.getElementById('doctorsGrid');
    const noDocsMsg = document.getElementById('noDoctorsMessage');
    
    if (docs.length === 0) {
        grid.innerHTML = '';
        noDocsMsg.classList.remove('hidden');
        return;
    }
    
    noDocsMsg.classList.add('hidden');
    grid.innerHTML = docs.map(d => `
        <div class="bg-white rounded-3xl overflow-hidden border border-slate-100 hover-scale shadow-sm">
            <div class="relative h-48 overflow-hidden">
                <img src="${d.image}" alt="${d.name}" class="w-full h-full object-cover">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1">
                    <i class="fa-solid fa-star text-yellow-500"></i> ${d.rating}
                </div>
            </div>
            <div class="p-6">
                <div class="text-sm text-indigo-600 font-semibold mb-1">${d.specialty}</div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">${d.name}</h3>
                <div class="flex items-center text-sm text-slate-500 mb-6">
                    <i class="fa-regular fa-comment-dots mr-2"></i> ${d.reviews} Patient Reviews
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium ${d.available ? 'text-green-500' : 'text-slate-400'}">
                        <i class="fa-solid fa-circle text-[10px] mr-1"></i> ${d.available ? 'Available Today' : 'Next Week'}
                    </span>
                    <button onclick="openModal(${d.id})" class="px-4 py-2 bg-slate-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100 hover:border-transparent">
                        Book
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAppointments() {
    const list = document.getElementById('appointmentsList');
    const emptyState = document.getElementById('emptyState');
    const countBadge = document.getElementById('appointmentCount');
    
    countBadge.textContent = `${appointments.length} Upcoming`;

    if (appointments.length === 0) {
        list.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    // Sort logic (simplistic)
    const sortedAppts = [...appointments].reverse();

    list.innerHTML = sortedAppts.map((appt, i) => `
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-100 transition-colors fade-in-up" ${i > 0 ? `style="animation-delay: ${i * 100}ms;"` : ''}>
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <i class="fa-regular fa-calendar-check text-xl"></i>
                </div>
                <div>
                    <h4 class="font-bold text-slate-900">${appt.doctorName || appt.specialty}</h4>
                    <p class="text-sm text-slate-500 mt-1">
                        <i class="fa-regular fa-clock mr-1"></i> ${appt.date} at ${appt.time}
                    </p>
                    <p class="text-xs text-slate-400 mt-1">Patient: ${appt.patientName}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="cancelAppointment(${appt.id})" class="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                    Cancel
                </button>
            </div>
        </div>
    `).join('');
}

function filterDoctors() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = DOCTORS.filter(d => 
        d.name.toLowerCase().includes(query) || 
        d.specialty.toLowerCase().includes(query)
    );
    renderDoctors(filtered);
    
    // Scroll to doctors section if not already there
    document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
}

function filterBySpecialty(specialty) {
    document.getElementById('searchInput').value = specialty;
    filterDoctors();
}

function populateSpecialtyDropdown() {
    const select = document.getElementById('specialty');
    const options = SPECIALTIES.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    select.innerHTML = '<option value="" disabled selected>Select department</option>' + options;
}

// Modal Form Logic
function openModal(doctorId = null) {
    const modal = document.getElementById('bookingModal');
    const doctorContainer = document.getElementById('selectedDoctorContainer');
    const genSpecSelect = document.getElementById('generalSpecialtySelect');
    const form = document.getElementById('bookingForm');
    
    // Reset form
    form.reset();
    
    if (doctorId) {
        const doctor = DOCTORS.find(d => d.id === doctorId);
        if (doctor) {
            document.getElementById('doctorId').value = doctor.id;
            document.getElementById('selectedDoctorName').textContent = doctor.name;
            document.getElementById('selectedDoctorSpecialty').textContent = doctor.specialty;
            document.getElementById('selectedDoctorImg').src = doctor.image;
            
            doctorContainer.classList.remove('hidden');
            genSpecSelect.classList.add('hidden');
        }
    } else {
        document.getElementById('doctorId').value = '';
        doctorContainer.classList.add('hidden');
        genSpecSelect.classList.remove('hidden');
    }
    
    modal.classList.remove('hidden');
    // small delay to allow display:block to apply before animating opacity
    setTimeout(() => {
        modal.querySelector('.bg-slate-900').classList.remove('opacity-0');
        modal.querySelector('.inline-block').classList.add('modal-enter');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('hidden');
}

function submitBooking() {
    const name = document.getElementById('patientName').value.trim();
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const docId = document.getElementById('doctorId').value;
    const spec = document.getElementById('specialty').value;
    
    if (!name || !date || !time) {
        alert('Please fill in all required fields (Name, Date, Time).');
        return;
    }
    
    let doctorName = '';
    let docSpecialty = '';
    
    if (docId) {
        const doctor = DOCTORS.find(d => d.id == docId);
        doctorName = doctor.name;
        docSpecialty = doctor.specialty;
    } else if (spec) {
        doctorName = 'Assigned Doctor';
        docSpecialty = spec;
    } else {
        alert('Please select a department or specific doctor.');
        return;
    }

    const newAppointment = {
        id: Date.now(),
        patientName: name,
        date: date,
        time: time,
        doctorId: docId,
        doctorName: doctorName,
        specialty: docSpecialty,
        status: 'confirmed'
    };

    appointments.push(newAppointment);
    localStorage.setItem('mediconnect_appointments', JSON.stringify(appointments));
    
    renderAppointments();
    closeModal();
    showToast();
}

function cancelAppointment(id) {
    if(confirm('Are you sure you want to cancel this appointment?')){
        appointments = appointments.filter(a => a.id !== id);
        localStorage.setItem('mediconnect_appointments', JSON.stringify(appointments));
        renderAppointments();
    }
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}
