<template>
  <div class="user-info-page">
    <div class="container">
      <div class="profile-card">

        <div class="profile-header">
          <div class="avatar">
            <span class="avatar-letter">{{ avatarLetter }}</span>
          </div>
          <div class="profile-title">
            <h2>{{ user.name || '—' }}</h2>
            <span :class="['role-badge', user.role === 'ADMIN' ? 'role-admin' : 'role-user']">
              {{ user.role || '—' }}
            </span>
          </div>
        </div>

        <div class="profile-body">
          <div class="info-row">
            <div class="info-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Username
            </div>
            <div class="info-value">{{ user.name || '—' }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email
            </div>
            <div class="info-value">{{ user.email || '—' }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Role
            </div>
            <div class="info-value">{{ user.role || '—' }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Member since
            </div>
            <div class="info-value">{{ formattedDate }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              User ID
            </div>
            <div class="info-value id-value">#{{ user.id || '—' }}</div>
          </div>
        </div>

        <div class="profile-footer">
          <router-link to="/" class="btn-back">← Back to Home</router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserInfo',
  props: ['action', 'id'],
  data() {
    return {
      user: {
        id: null,
        name: null,
        email: null,
        role: null,
        created: null,
      },
    };
  },
  computed: {
    avatarLetter() {
      return this.user.name ? this.user.name.charAt(0).toUpperCase() : '?';
    },
    formattedDate() {
      if (!this.user.created) return '—';
      const d = new Date(this.user.created);
      if (isNaN(d)) return this.user.created;
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  },
  methods: {
    async getAndUpdateUserInfo() {
      try {
        const response = await axios.get('/auth/info');
        if (response.data) {
          this.user.id      = response.data.user_id;
          this.user.name    = response.data.user_name;
          this.user.email   = response.data.user_email;
          this.user.role    = response.data.user_role;
          this.user.created = response.data.user_created;
        }
      } catch (ex) {
        console.error('Error fetching user data:', ex);
        alert('Failed to load user data. Please try again later.');
      }
    }
  },
  created() {
    this.getAndUpdateUserInfo();
  }
};
</script>

<style scoped>
.user-info-page {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 40px;
  background-color: #EEEFF2;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 560px;
  padding: 0 20px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
  overflow: hidden;
}

/* ── Header ── */
.profile-header {
  background: linear-gradient(135deg, #0077b6, #023e8a);
  padding: 36px 32px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-letter {
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.profile-title h2 {
  margin: 0 0 8px 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.role-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.role-admin {
  background: rgba(255, 200, 0, 0.25);
  color: #ffe566;
  border: 1px solid rgba(255, 200, 0, 0.4);
}

.role-user {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

/* ── Body ── */
.profile-body {
  padding: 8px 0;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 140px;
  flex-shrink: 0;
}

.info-label svg {
  width: 16px;
  height: 16px;
  color: #0077b6;
  flex-shrink: 0;
}

.info-value {
  color: #222;
  font-weight: 600;
  font-size: 0.95rem;
  text-align: right;
  word-break: break-all;
}

.id-value {
  color: #0077b6;
  font-family: monospace;
  font-size: 1rem;
}

/* ── Footer ── */
.profile-footer {
  padding: 20px 32px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
}

.btn-back {
  display: inline-block;
  background-color: #0077b6;
  color: white;
  text-decoration: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.btn-back:hover {
  background-color: #005a8e;
}

@media (max-width: 480px) {
  .profile-header {
    padding: 24px 20px 20px;
    flex-direction: column;
    text-align: center;
  }

  .info-row {
    padding: 14px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-value {
    text-align: left;
  }

  .profile-footer {
    padding: 16px 20px 20px;
  }
}
</style>
