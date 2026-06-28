import api from './api';

export const getAdminStats        = async ()                 => (await api.get('/api/admin/stats')).data;
export const getAdminUsers        = async (page=0,size=20,q) => (await api.get('/api/admin/users', { params:{page,size,q} })).data;
export const getAdminUser         = async (id)               => (await api.get(`/api/admin/users/${id}`)).data;
export const toggleAdminPremium   = async (id, premium)      => (await api.post(`/api/admin/users/${id}/toggle-premium`, { premium })).data;
export const setAdminUserRole     = async (id, role)         => (await api.post(`/api/admin/users/${id}/role`, { role })).data;
export const getAdminPayments     = async (page=0,size=20)   => (await api.get('/api/admin/payments', { params:{page,size} })).data;
export const getAdminAiStats      = async ()                 => (await api.get('/api/admin/ai-stats')).data;
export const getAdminReferralStats= async ()                 => (await api.get('/api/admin/referral-stats')).data;
