'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import mainLogo from '@/assets/logotype/main.png';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { api } from '@/services/api';

// Route constants
const ADMIN_TEAM = '/admin/team';
const ADMIN_INBOX = '/admin/inbox';
const ADMIN_PROJECTS = '/admin/projects';
const ADMIN_BLOG = '/admin/blog';
const ADMIN_CONTENT = '/admin/content';
const ADMIN_SERVICES = '/admin/services';

export default function TeamManagementPage() {
    const [teamMembers, setTeamMembers] = useState<any>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<any>(null);
    const [memberToEdit, setMemberToEdit] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});

    const [formData, setFormData] = useState<any>({
        name: '',
        post: '',
        description: '',
        image: null,
        linkedin: '',
        instagram: ''
    });

    const router = useRouter();

    useEffect(() => {
        document.title = "Gestion d'Équipe | Landmark Administration";
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        setIsLoading(true);
        try {
            const data = await api.team.getAll();
            setTeamMembers(data);
        } catch (err) {
            console.error('Error fetching team members:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (member: any) => {
        setMemberToDelete(member);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!memberToDelete) return;

        setIsDeleting(true);
        try {
            await api.team.delete(memberToDelete.id);
            toast.success('Membre supprimé avec succès');
            fetchTeamMembers();
            setShowDeleteModal(false);
            setMemberToDelete(null);
        } catch (err: any) {
            console.error(err.message || "Suppression échouée !");
            toast.error(err.message || "Suppression échouée !");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreateClick = () => {
        setFormData({
            name: '',
            post: '',
            description: '',
            image: null,
            linkedin: '',
            instagram: ''
        });
        setErrors({});
        setShowCreateForm(true);
        setShowUpdateForm(false);
    };

    const handleEditClick = (member: any) => {
        setMemberToEdit(member);
        setFormData({
            name: member.name,
            post: member.post,
            description: member.description,
            image: null,
            linkedin: member.linkedin || '',
            instagram: member.instagram || ''
        });
        setErrors({});
        setShowUpdateForm(true);
        setShowCreateForm(false);
    };

    const handleInputChange = (e: any) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData((prev: any) => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData((prev: any) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('post', formData.post);
            formDataToSend.append('description', formData.description);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            formDataToSend.append('linkedin', formData.linkedin);
            formDataToSend.append('instagram', formData.instagram);

            await api.team.create(formDataToSend);

            fetchTeamMembers();
            setShowCreateForm(false);
            toast.success('Membre ajouté avec succès');
        } catch (err: any) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                toast.error(err.message || "Création échouée !");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberToEdit) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('post', formData.post);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('linkedin', formData.linkedin);
            formDataToSend.append('instagram', formData.instagram);
            formDataToSend.append('_method', 'PUT');

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            await api.team.update(memberToEdit.id, formDataToSend);

            fetchTeamMembers();
            setShowUpdateForm(false);
            setMemberToEdit(null);
            toast.success('Profil mis à jour');
        } catch (err: any) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                toast.error(err.message || "Mise à jour échouée !");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await api.logout().catch(() => null);
        router.push('/');
    };

    const navigateTo = (path: string) => router.push(path);

    const adminCards = [
        { title: "Équipe", icon: '👥', path: ADMIN_TEAM, active: true },
        { title: 'Projets', icon: '📁', path: ADMIN_PROJECTS },
        { title: 'Contenu', icon: '✍️', path: ADMIN_CONTENT },
        { title: 'Blog', icon: '🖼️', path: ADMIN_BLOG },
        { title: 'Inbox', icon: '📨', path: ADMIN_INBOX },
        { title: 'Services', icon: '🛠️', path: ADMIN_SERVICES },
    ];

    return (
        <div className="font-jost bg-[#fcfdfe] min-h-screen pb-20 overflow-x-hidden">
            {/* Navigtaion Bar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 h-24 flex items-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full flex justify-between items-center">
                    <Link href="/admin">
                        <Image src={mainLogo} alt="Landmark" className="h-10 md:h-12 w-auto object-contain" priority />
                    </Link>
                    <button onClick={handleLogout} className="bg-[#010E26] text-white px-6 py-3 rounded-2xl hover:bg-[#445EF2] transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#010E26]/10 active:scale-95">
                        Déconnexion
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
                {/* Mini Navigation */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {adminCards.map((card, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigateTo(card.path)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${card.active ? 'bg-[#010E26] text-white shadow-xl shadow-[#010E26]/20' : 'bg-white text-gray-400 border border-gray-100 hover:border-[#445EF2] hover:text-[#445EF2]'}`}
                        >
                            <span className="mr-2">{card.icon}</span> {card.title}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#010E26] uppercase font-bodoni mb-2">Gestion d'Équipe</h1>
                        <p className="text-gray-500 font-medium">Ajoutez, modifiez ou supprimez les membres de votre équipe.</p>
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="bg-[#445EF2] text-white px-8 py-4 rounded-2xl hover:bg-[#010E26] transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-[#445EF2]/20 flex items-center gap-2 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        Nouveau Membre
                    </button>
                </div>

                {/* Forms Section */}
                <AnimatePresence mode="wait">
                    {(showCreateForm || showUpdateForm) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <div className={`p-8 md:p-10 rounded-[2.5rem] border ${showUpdateForm ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50/50 border-gray-100'}`}>
                                <h2 className="text-2xl font-black text-[#010E26] uppercase mb-8">
                                    {showCreateForm ? 'Ajouter un nouveau membre' : `Modifier: ${memberToEdit?.name}`}
                                </h2>
                                <form onSubmit={showCreateForm ? handleCreateSubmit : handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Nom complet *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all" />
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.name[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Poste *</label>
                                        <input type="text" name="post" value={formData.post} onChange={handleInputChange} required className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all" />
                                        {errors.post && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.post[0]}</p>}
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description *</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all" />
                                        {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.description[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">LinkedIn</label>
                                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Instagram</label>
                                        <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Photo {showCreateForm ? '*' : '(optionnel)'}</label>
                                        <input type="file" name="image" onChange={handleInputChange} accept="image/*" required={showCreateForm} className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-100 file:text-[#010E26] hover:file:bg-[#445EF2] hover:file:text-white file:transition-all" />
                                        {errors.image && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.image[0]}</p>}
                                    </div>
                                    <div className="md:col-span-2 flex gap-4 pt-4">
                                        <button disabled={isSubmitting} type="submit" className="flex-1 bg-[#445EF2] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#010E26] transition-all disabled:opacity-50">
                                            {isSubmitting ? 'Opération en cours...' : showCreateForm ? 'Ajouter au Landmark' : 'Enregistrer les modifications'}
                                        </button>
                                        <button onClick={() => { setShowCreateForm(false); setShowUpdateForm(false); }} type="button" className="px-8 bg-white text-gray-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-gray-100 hover:border-red-500 hover:text-red-500 transition-all">
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Team Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#445EF2] rounded-full animate-spin mb-6"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Chargement de l'équipe...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.data?.map((member: any) => (
                            <motion.div
                                layout
                                key={member.id}
                                className="group bg-white rounded-[2.5rem] p-6 border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.05)] transition-all flex flex-col h-full"
                            >
                                <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden mb-6 bg-gray-100">
                                    {member.image ? (
                                        <img src={`https://api.Landmark.ma/storage/${member.image}`} alt={member.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-300 font-black uppercase text-[10px]">No Identity</div>
                                    )}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                                        <button onClick={() => handleEditClick(member)} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#010E26] hover:bg-[#445EF2] hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg></button>
                                        <button onClick={() => handleDeleteClick(member)} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <span className="text-[#445EF2] font-black uppercase text-[10px] tracking-[0.2em] mb-1 block">{member.post}</span>
                                    <h3 className="text-xl font-bold text-[#010E26] uppercase mb-3">{member.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed mb-6">{member.description}</p>
                                </div>
                                <div className="flex gap-4 pt-6 border-t border-gray-50">
                                    {member.linkedin && <a href={member.linkedin} target="_blank" className="text-gray-400 hover:text-[#445EF2] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>}
                                    {member.instagram && <a href={member.instagram} target="_blank" className="text-gray-400 hover:text-pink-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259 0 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg></a>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg></div>
                            <h3 className="text-2xl font-black text-[#010E26] uppercase mb-4">Confirmer la suppression</h3>
                            <p className="text-gray-500 font-medium mb-1">Êtes-vous sûr de vouloir supprimer</p>
                            <p className="text-[#010E26] font-black uppercase text-lg mb-8">"{memberToDelete?.name}" ?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowDeleteModal(false)} disabled={isDeleting} className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all">Annuler</button>
                                <button onClick={handleConfirmDelete} disabled={isDeleting} className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center">
                                    {isDeleting ? 'En cours...' : 'Supprimer'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
