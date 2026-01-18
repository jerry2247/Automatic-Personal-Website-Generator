import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';

// ============================================
// CSS CONTENT (Stored as a string constant)
// ============================================
const CSS_CONTENT = `@charset "utf-8";

*,
*::before,
*::after {
    box-sizing: border-box;
    line-height: 1.5;
}

html,
body {
    color: rgb(85, 85, 85);
    margin: 0;
    padding: 0;
}

html {
    font-family: "Open Sans", "Helvetica Neue", "Times New Roman", Times, serif;
    font-size: 12px;
    overflow-y: scroll;
}

@media (min-width: 600px) {
    html {
        font-size: 16px;
    }
}

body {
    text-size-adjust: 100%;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    color: rgb(53, 53, 53);
    font-family: "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif;
    line-height: normal;
}

a {
    color: rgb(74, 154, 225);
    text-decoration: none;
}

a:hover {
    color: rgb(151, 151, 151);
    text-decoration: none;
}

.main {
    max-width: 800px;
    width: 80%;
    margin: 0 auto;
    padding: 2rem 0;
}

a:focus-visible {
    outline: 2px solid rgb(74, 154, 225);
    outline-offset: 3px;
    border-radius: 6px;
}

.bio-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 1.5rem;
}

.name {
    font-size: 1.9rem;
    font-weight: 700;
    margin: 0;
}

.bio-paragraph {
    margin: 0.75rem 0 0 0;
}

.bio-img {
    width: 170px;
    height: auto;
    flex: 0 0 auto;
    border-radius: 8px;
}

@media (max-width: 680px) {
    .main {
        width: 88%;
    }

    .bio-wrapper {
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.25rem;
    }

    .bio-img {
        width: 130px;
    }
}

.p-section {
    margin-top: 1.5rem;
}

.section-divider {
    border: 0;
    border-top: 1px solid rgb(229, 229, 229);
    margin: 1.25rem 0;
}

.section-header {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
}

.exp-item {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    padding: 0.75rem 0;
}

.exp-logo {
    width: 40px;
    height: 40px;
    margin-top: 0.25rem;
    object-fit: cover;
    flex: 0 0 auto;
    border: 1px solid rgb(229, 229, 229);
    background: white;
}

.exp-logo.wordmark {
    object-fit: contain;
}

.exp-content {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
}

.exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
}

.exp-title {
    color: rgb(53, 53, 53);
    font-weight: 700;
    font-family: "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif;
}

.exp-date {
    color: rgb(152, 146, 146);
    font-family: "Roboto Mono", Menlo, Palatino, "Palatino LT STD",
        "Palatino Linotype", "Book Antiqua", Georgia, serif;
    letter-spacing: 0.5px;
    font-size: 0.85rem;
    white-space: nowrap;
}

.exp-subtitle {
    margin-top: 0.4rem;
}

@media (max-width: 680px) {
    .exp-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.15rem;
    }

    .exp-date {
        white-space: normal;
    }
}

.catalogue-item-post {
    border-bottom: 1px solid rgb(229, 229, 229);
    color: rgb(85, 85, 85);
    display: block;
    padding: 0.5rem 0;
}

.catalogue-item-post:last-child {
    border: 0;
}

.catalogue-title-post {
    font-size: 1rem;
    margin: 0.5rem 0;
}

.catalogue-line {
    transition: 0.3s ease-out;
    border-top: 0.2rem solid rgb(53, 53, 53);
    display: block;
    width: 2rem;
}

.catalogue-preview_img {
    object-fit: cover;
    opacity: 0.75;
    border: 1px solid rgb(0, 0, 0);
}

.catalogue-item-post:hover .catalogue-line,
.catalogue-item-post:focus-visible .catalogue-line {
    width: 5rem;
}

.catalogue-item-post:hover .catalogue-preview_img,
.catalogue-item-post:focus-visible .catalogue-preview_img {
    opacity: 1;
}

.project-item {
    border-radius: 6px;
}

.project-media {
    margin: 1rem 0 0.5rem 0;
}

.project-subtitle {
    margin: 0.75rem 0 0 0;
}

@media (max-width: 425px) {
    .catalogue-preview_img {
        height: 50px;
    }
}

.links {
    margin: 1.5rem 0 0 0;
}

.dot {
    margin: 0 0.35rem;
}`;

// ============================================
// STEP DEFINITIONS
// ============================================
const STEPS = [
  { id: 0, title: 'Welcome', icon: '👋' },
  { id: 1, title: 'Basic Info', icon: '👤' },
  { id: 2, title: 'Profile Photo', icon: '📷' },
  { id: 3, title: 'Experiences', icon: '💼' },
  { id: 4, title: 'Projects', icon: '🚀' },
  { id: 5, title: 'Export', icon: '📦' },
];

// ============================================
// INITIAL EMPTY STATE
// ============================================
const INITIAL_FORM_DATA = {
  fullName: '',
  hats: ['', '', ''], // 3 optional hats/areas
  bio: '',
  email: '',
  profilePhoto: null, // File object
  profilePhotoPreview: null, // Data URL for preview
  experiences: [],
  projects: [],
};

// ============================================
// HTML GENERATION FUNCTION
// ============================================
function generateHTML(data) {
  const hatsDisplay = data.hats.filter(h => h.trim()).join(' · ');
  
  // Generate experience HTML with correct image paths
  const experienceItemsHTML = data.experiences.map((exp, index) => {
    const logoSrc = exp.logo 
      ? `images/exp-logo-${index}.${exp.logo.name?.split('.').pop() || 'png'}`
      : 'images/placeholder-logo.png';
    return `
                    <div class="exp-item">
                        <img
                            class="exp-logo${exp.logoWordmark ? ' wordmark' : ''}"
                            src="${logoSrc}"
                            alt="${exp.company} logo"
                            loading="lazy"
                            width="40"
                            height="40"
                        />
                        <div class="exp-content">
                            <div class="exp-header">
                                <span class="exp-title">${exp.title} · ${exp.company}</span>
                                <span class="exp-date">${exp.date}</span>
                            </div>
                            <div class="exp-subtitle">
                                ${exp.description}
                            </div>
                        </div>
                    </div>`;
  }).join('\n');

  // Generate project HTML with correct image paths
  const projectItemsHTML = data.projects.map((project, index) => {
    const imageSrc = project.image 
      ? `images/project-${index}.${project.image.name?.split('.').pop() || 'jpg'}`
      : null;
    return `
                    <a
                        href="${project.link || '#'}"
                        class="catalogue-item-post project-item"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h3 class="catalogue-title-post project-title">
                            ${project.title}
                        </h3>
                        <div class="catalogue-line"></div>
                        <p class="project-subtitle">
                            ${project.subtitle}
                        </p>
                        ${imageSrc ? `
                        <div class="project-media">
                            <img
                                class="catalogue-preview_img project-img"
                                width="100%"
                                height="170"
                                src="${imageSrc}"
                                alt="Project preview: ${project.title}"
                                loading="lazy"
                            />
                        </div>` : ''}
                    </a>`;
  }).join('\n');

  const emailDisplay = data.email.replace('@', ' [at] ').replace('.', ' [dot] ');

  return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap"
            rel="stylesheet"
        />
        <link
            href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700&display=swap"
            rel="stylesheet"
        />

        <title>${data.fullName}</title>
        <link rel="stylesheet" href="style.css" />
    </head>

    <body>
        <main class="main">
            <section id="about">
                <div class="bio-wrapper">
                    <div class="bio-text">
                        <h1 class="name">${data.fullName}.</h1>

                        <p class="bio-paragraph">
                            ${hatsDisplay ? `<b>${hatsDisplay}</b><br /><br />` : ''}
                            ${data.bio}

                            <br /><br />
                            Contact me at
                            <u>${emailDisplay}</u>.
                        </p>
                    </div>

                    <img
                        src="images/profile.jpg"
                        class="bio-img"
                        alt="Photo of ${data.fullName}"
                        loading="lazy"
                        width="170"
                        height="170"
                    />
                </div>

                ${data.experiences.length > 0 ? `
                <div class="p-section">
                    <hr class="section-divider" />
                    <h2 class="section-header">Experience</h2>
${experienceItemsHTML}
                </div>` : ''}

                ${data.projects.length > 0 ? `
                <div class="p-section">
                    <hr class="section-divider" />
                    <h2 class="section-header">Projects</h2>
${projectItemsHTML}
                </div>` : ''}

            </section>
        </main>
    </body>
</html>`;
}

// ============================================
// STEP COMPONENTS
// ============================================

// Step 0: Welcome/Landing
function WelcomeStep({ onStart }) {
  return (
    <div className="step-content welcome-step">
      <h1 className="welcome-title">
        Your personal website,<br />
        <span className="welcome-gradient">in 2 minutes.</span>
      </h1>
      <p className="welcome-subtitle">
        You deserve a website that looks as good as your work. 
        Just answer a few questions, and we'll handle the rest.
      </p>
      
      <button className="start-btn" onClick={onStart}>
        Let's Build It
      </button>
    </div>
  );
}

// Step 1: Basic Info
function BasicInfoStep({ formData, setFormData }) {
  const updateHat = (index, value) => {
    const newHats = [...formData.hats];
    newHats[index] = value;
    setFormData({ ...formData, hats: newHats });
  };

  return (
    <div className="step-content">
      <h2 className="step-title">Tell us about yourself</h2>

      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input
          type="text"
          id="fullName"
          placeholder="e.g., John Smith"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Your Hats / Areas <span className="optional">(optional)</span></label>
        <p className="field-hint">What do you do? Add up to 3 roles or areas.</p>
        <div className="hats-grid">
          {formData.hats.map((hat, index) => (
            <input
              key={index}
              type="text"
              placeholder={`e.g., ${['AI Researcher', 'Software Engineer', 'Stanford Student'][index]}`}
              value={hat}
              onChange={(e) => updateHat(index, e.target.value)}
            />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="bio">One-Sentence Bio *</label>
        <textarea
          id="bio"
          placeholder="e.g., I build AI systems and ship software that turns research into products with real-world impact."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          placeholder="e.g., yourname@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
    </div>
  );
}

// Step 2: Profile Photo
function ProfilePhotoStep({ formData, setFormData }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePhoto: file,
          profilePhotoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setFormData({
      ...formData,
      profilePhoto: null,
      profilePhotoPreview: null,
    });
  };

  return (
    <div className="step-content">
      <h2 className="step-title">Upload your photo</h2>

      <div className="photo-upload-area">
        {formData.profilePhotoPreview ? (
          <div className="photo-preview-container">
            <img
              src={formData.profilePhotoPreview}
              alt="Profile preview"
              className="photo-preview"
            />
            <button className="remove-photo-btn" onClick={handleRemove}>
              ✕ Remove
            </button>
          </div>
        ) : (
          <label className="upload-dropzone">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            <div className="dropzone-content">
              <div className="dropzone-icon"></div>
              <span className="dropzone-text">Click to upload photo</span>
              <span className="dropzone-hint">JPG, PNG up to 5MB</span>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}

// Month options for dropdown
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate year options (current year + 5 years ahead, 30 years back)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 36 }, (_, i) => currentYear + 5 - i);

// Helper to format date from dropdowns
function formatDateRange(startMonth, startYear, endMonth, endYear, isCurrent) {
  const start = startMonth && startYear ? `${startMonth} ${startYear}` : '';
  const end = isCurrent ? 'Present' : (endMonth && endYear ? `${endMonth} ${endYear}` : '');
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  return '';
}

// Step 3: Experiences  
function ExperiencesStep({ formData, setFormData }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentExp, setCurrentExp] = useState({
    title: '',
    company: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    isCurrent: false,
    description: '',
    logo: null,
    logoPreview: null,
  });

  // Compute formatted date string
  const getFormattedDate = (exp) => {
    return formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.isCurrent);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentExp({
          ...currentExp,
          logo: file,
          logoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const expToSave = {
      ...currentExp,
      date: getFormattedDate(currentExp), // Store formatted date string
    };
    
    if (editingIndex !== null) {
      const newExperiences = [...formData.experiences];
      newExperiences[editingIndex] = { ...expToSave, id: formData.experiences[editingIndex].id };
      setFormData({ ...formData, experiences: newExperiences });
    } else {
      setFormData({
        ...formData,
        experiences: [...formData.experiences, { ...expToSave, id: Date.now() }],
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentExp({
      title: '',
      company: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      isCurrent: false,
      description: '',
      logo: null,
      logoPreview: null,
    });
  };

  const handleEdit = (index) => {
    setCurrentExp(formData.experiences[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDelete = (index) => {
    const newExperiences = formData.experiences.filter((_, i) => i !== index);
    setFormData({ ...formData, experiences: newExperiences });
  };

  const isFormValid = currentExp.title && currentExp.company && 
    currentExp.startMonth && currentExp.startYear && 
    (currentExp.isCurrent || (currentExp.endMonth && currentExp.endYear)) &&
    currentExp.description;

  return (
    <div className="step-content">
      <h2 className="step-title">Add your experiences</h2>

      {/* Existing experiences list */}
      {formData.experiences.length > 0 && !isAdding && (
        <div className="items-list">
          {formData.experiences.map((exp, index) => (
            <div key={exp.id} className="item-card">
              <div className="item-card-content">
                {exp.logoPreview && (
                  <img src={exp.logoPreview} alt="" className="item-card-logo" />
                )}
                <div className="item-card-info">
                  <h4>{exp.title} · {exp.company}</h4>
                  <span className="item-card-date">{exp.date}</span>
                  <p>{exp.description}</p>
                </div>
              </div>
              <div className="item-card-actions">
                <button onClick={() => handleEdit(index)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(index)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {isAdding ? (
        <div className="add-item-form">
          <h3>{editingIndex !== null ? 'Edit Experience' : 'New Experience'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                placeholder="e.g., Software Engineer"
                value={currentExp.title}
                onChange={(e) => setCurrentExp({ ...currentExp, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                placeholder="e.g., Google"
                value={currentExp.company}
                onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Start Date *</label>
            <div className="date-row">
              <select
                value={currentExp.startMonth}
                onChange={(e) => setCurrentExp({ ...currentExp, startMonth: e.target.value })}
                className="date-select"
              >
                <option value="">Month</option>
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={currentExp.startYear}
                onChange={(e) => setCurrentExp({ ...currentExp, startYear: e.target.value })}
                className="date-select"
              >
                <option value="">Year</option>
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <div className="date-row">
              <select
                value={currentExp.endMonth}
                onChange={(e) => setCurrentExp({ ...currentExp, endMonth: e.target.value })}
                className="date-select"
                disabled={currentExp.isCurrent}
              >
                <option value="">Month</option>
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={currentExp.endYear}
                onChange={(e) => setCurrentExp({ ...currentExp, endYear: e.target.value })}
                className="date-select"
                disabled={currentExp.isCurrent}
              >
                <option value="">Year</option>
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <label className="checkbox-label current-checkbox">
                <input
                  type="checkbox"
                  checked={currentExp.isCurrent}
                  onChange={(e) => setCurrentExp({ 
                    ...currentExp, 
                    isCurrent: e.target.checked,
                    endMonth: e.target.checked ? '' : currentExp.endMonth,
                    endYear: e.target.checked ? '' : currentExp.endYear,
                  })}
                />
                Current position
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="Describe your role and achievements..."
              value={currentExp.description}
              onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Company Logo <span className="optional">(optional)</span></label>
            <div className="logo-upload-row">
              {currentExp.logoPreview ? (
                <div className="logo-preview-small">
                  <img src={currentExp.logoPreview} alt="Logo preview" />
                  <button onClick={() => setCurrentExp({ ...currentExp, logo: null, logoPreview: null })}>✕</button>
                </div>
              ) : (
                <label className="upload-btn-small">
                  <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
                  Upload Logo
                </label>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={resetForm}>Cancel</button>
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={!isFormValid}
            >
              {editingIndex !== null ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </div>
      ) : (
        <button className="add-item-btn" onClick={() => setIsAdding(true)}>
          + Add Experience
        </button>
      )}
    </div>
  );
}

// Step 4: Projects
function ProjectsStep({ formData, setFormData }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    subtitle: '',
    link: '',
    image: null,
    imagePreview: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProject({
          ...currentProject,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      const newProjects = [...formData.projects];
      newProjects[editingIndex] = { ...currentProject, id: formData.projects[editingIndex].id };
      setFormData({ ...formData, projects: newProjects });
    } else {
      setFormData({
        ...formData,
        projects: [...formData.projects, { ...currentProject, id: Date.now() }],
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentProject({
      title: '',
      subtitle: '',
      link: '',
      image: null,
      imagePreview: null,
    });
  };

  const handleEdit = (index) => {
    setCurrentProject(formData.projects[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDelete = (index) => {
    const newProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: newProjects });
  };

  return (
    <div className="step-content">
      <h2 className="step-title">Showcase your projects</h2>

      {/* Existing projects list */}
      {formData.projects.length > 0 && !isAdding && (
        <div className="items-list">
          {formData.projects.map((project, index) => (
            <div key={project.id} className="item-card">
              <div className="item-card-content">
                {project.imagePreview && (
                  <img src={project.imagePreview} alt="" className="item-card-image" />
                )}
                <div className="item-card-info">
                  <h4>{project.title}</h4>
                  <p>{project.subtitle}</p>
                  {project.link && <span className="item-card-link">{project.link}</span>}
                </div>
              </div>
              <div className="item-card-actions">
                <button onClick={() => handleEdit(index)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(index)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {isAdding ? (
        <div className="add-item-form">
          <h3>{editingIndex !== null ? 'Edit Project' : 'New Project'}</h3>
          
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              placeholder="e.g., AI-Powered Image Generator"
              value={currentProject.title}
              onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Short Description *</label>
            <textarea
              placeholder="e.g., A real-time deepfake detector with 98% accuracy..."
              value={currentProject.subtitle}
              onChange={(e) => setCurrentProject({ ...currentProject, subtitle: e.target.value })}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Project Link <span className="optional">(optional)</span></label>
            <input
              type="url"
              placeholder="https://..."
              value={currentProject.link}
              onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Project Image <span className="optional">(optional)</span></label>
            {currentProject.imagePreview ? (
              <div className="image-preview-container">
                <img src={currentProject.imagePreview} alt="Project preview" className="image-preview" />
                <button 
                  className="remove-image-btn"
                  onClick={() => setCurrentProject({ ...currentProject, image: null, imagePreview: null })}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <label className="upload-btn-small">
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                Upload Image
              </label>
            )}
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={resetForm}>Cancel</button>
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={!currentProject.title || !currentProject.subtitle}
            >
              {editingIndex !== null ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </div>
      ) : (
        <button className="add-item-btn" onClick={() => setIsAdding(true)}>
          + Add Project
        </button>
      )}
    </div>
  );
}

// Step 5: Export
function ExportStep({ formData, onExport, isGenerating, onPreview }) {
  const [showPreview, setShowPreview] = useState(false);
  const hatsDisplay = formData.hats.filter(h => h.trim()).join(' · ');

  const handlePreview = () => {
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  // Generate preview HTML with embedded images
  const getPreviewHTML = () => {
    const html = generateHTML(formData);
    const css = CSS_CONTENT;
    
    // Create a complete HTML document with embedded CSS and base64 images
    let previewHTML = html.replace(
      '<link rel="stylesheet" href="style.css" />',
      `<style>${css}</style>`
    );
    
    // Replace profile photo with data URL if available
    if (formData.profilePhotoPreview) {
      previewHTML = previewHTML.replace(
        'src="images/profile.jpg"',
        `src="${formData.profilePhotoPreview}"`
      );
    }
    
    // Replace experience logos with data URLs
    formData.experiences.forEach((exp, index) => {
      if (exp.logoPreview) {
        const extension = exp.logo?.name?.split('.').pop() || 'png';
        previewHTML = previewHTML.replace(
          `src="images/exp-logo-${index}.${extension}"`,
          `src="${exp.logoPreview}"`
        );
      }
    });
    
    // Replace project images with data URLs
    formData.projects.forEach((project, index) => {
      if (project.imagePreview) {
        const extension = project.image?.name?.split('.').pop() || 'jpg';
        previewHTML = previewHTML.replace(
          `src="images/project-${index}.${extension}"`,
          `src="${project.imagePreview}"`
        );
      }
    });
    
    return previewHTML;
  };

  return (
    <div className="step-content export-step">
      <h2 className="step-title">Ready to export!</h2>

      <div className="export-summary">
        <div className="summary-section">
          <h3>Profile</h3>
          <div className="summary-item">
            <strong>Name:</strong> {formData.fullName || '—'}
          </div>
          {hatsDisplay && (
            <div className="summary-item">
              <strong>Hats:</strong> {hatsDisplay}
            </div>
          )}
          <div className="summary-item">
            <strong>Bio:</strong> {formData.bio || '—'}
          </div>
          <div className="summary-item">
            <strong>Email:</strong> {formData.email || '—'}
          </div>
          <div className="summary-item">
            <strong>Photo:</strong> {formData.profilePhoto ? '✓ Uploaded' : '— Not uploaded'}
          </div>
        </div>

        <div className="summary-section">
          <h3>Content</h3>
          <div className="summary-item">
            <strong>Experiences:</strong> {formData.experiences.length} added
          </div>
          <div className="summary-item">
            <strong>Projects:</strong> {formData.projects.length} added
          </div>
        </div>
      </div>

      <div className="export-buttons">
        <button 
          className="preview-button"
          onClick={handlePreview}
          disabled={!formData.fullName || !formData.email}
        >
          Preview Website
        </button>
        <button 
          className="download-button"
          onClick={onExport}
          disabled={isGenerating || !formData.fullName || !formData.email}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            'Download Website'
          )}
        </button>
      </div>

      {(!formData.fullName || !formData.email) && (
        <p className="export-warning">Please fill in your name and email to export.</p>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal-overlay" onClick={closePreview}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <span className="preview-title">Website Preview</span>
              <button className="preview-close" onClick={closePreview}>✕</button>
            </div>
            <div className="preview-frame-container">
              <iframe
                title="Website Preview"
                srcDoc={getPreviewHTML()}
                className="preview-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isGenerating, setIsGenerating] = useState(false);

  const goToStep = (step) => {
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
    }
  };

  const handleExport = async () => {
    setIsGenerating(true);

    try {
      const zip = new JSZip();

      // 1. Generate HTML
      const htmlContent = generateHTML(formData);
      zip.file("index.html", htmlContent);

      // 2. Add CSS
      zip.file("style.css", CSS_CONTENT);

      // 3. Create images folder
      const imagesFolder = zip.folder("images");

      // Add profile photo if uploaded
      if (formData.profilePhoto) {
        imagesFolder.file("profile.jpg", formData.profilePhoto);
      }

      // Add experience logos
      formData.experiences.forEach((exp, index) => {
        if (exp.logo) {
          const extension = exp.logo.name?.split('.').pop() || 'png';
          imagesFolder.file(`exp-logo-${index}.${extension}`, exp.logo);
        }
      });

      // Add project images
      formData.projects.forEach((project, index) => {
        if (project.image) {
          const extension = project.image.name?.split('.').pop() || 'jpg';
          imagesFolder.file(`project-${index}.${extension}`, project.image);
        }
      });

      // 4. Generate and download zip
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const fileName = formData.fullName 
        ? `${formData.fullName.toLowerCase().replace(/\s+/g, '-')}-site.zip`
        : 'my-site.zip';
      saveAs(zipBlob, fileName);

    } catch (error) {
      console.error("Error generating zip:", error);
      alert("Error generating website bundle. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onStart={() => goToStep(1)} />;
      case 1:
        return <BasicInfoStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <ProfilePhotoStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <ExperiencesStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <ProjectsStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <ExportStep formData={formData} onExport={handleExport} isGenerating={isGenerating} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="wizard-container">
        {/* Step Content */}
        <div className="step-container">
          {renderStep()}
        </div>

        {/* Navigation Buttons - hide on welcome screen */}
        {currentStep > 0 && (
          <div className="nav-buttons">
            <button 
              className="nav-btn prev-btn"
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              ← Back
            </button>
            {currentStep < 5 && (
              <button 
                className="nav-btn next-btn"
                onClick={() => goToStep(currentStep + 1)}
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
