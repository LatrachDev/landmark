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

export default function ServicesManagementPage() {
    const [services, setServices] = useState<any>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<any>(null);
    const [serviceToEdit, setServiceToEdit] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});

    const [formData, setFormData] = useState<any>({
        title: '',
        description: '',
        image: null,
        currentImage: null,
        category: 'A',
    });

    const router = useRouter();

    useEffect(() => {
        document.title = "Gestion des Services | Landmark Administration";
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const data = await api.services.getAll();
            setServices(data);
            setErrors({});
        } catch (err: any) {
            setErrors({ general: err.message || 'Erreur réseau lors du chargement des services' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (service: any) => {
        setServiceToDelete(service);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!serviceToDelete) return;

        setIsDeleting(true);
        try {
            await api.services.delete(serviceToDelete.id);
            toast.success('Service supprimé avec succès');
            fetchServices();
            setShowDeleteModal(false);
            setServiceToDelete(null);
        } catch (err: any) {
            setErrors({ general: err.message || "Erreur lors de la suppression" });
            toast.error(err.message || "Erreur lors de la suppression");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreateClick = () => {
        setFormData({
            title: '',
            description: '',
            image: null,
            currentImage: null,
            category: 'A',
        });
        setErrors({});
        setShowCreateForm(true);
        setShowUpdateForm(false);
    };

    const handleEditClick = (service: any) => {
        setServiceToEdit(service);
        setFormData({
            title: service.title,
            description: service.description,
            image: null,
            currentImage: service.image,
            category: service.category,
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
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            await api.services.create(formDataToSend);

            fetchServices();
            setShowCreateForm(false);
            toast.success('Nouveau service ajouté');
        } catch (err: any) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setErrors({ general: err.message || "Une erreur s'est produite." });
                toast.error(err.message || "Erreur lors de la création");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceToEdit) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('_method', 'PUT');

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            await api.services.update(serviceToEdit.id, formDataToSend);

            fetchServices();
            setShowUpdateForm(false);
            setServiceToEdit(null);
            toast.success('Service mis à jour');
        } catch (err: any) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setErrors({ general: err.message || "Une erreur s'est produite lors de la mise à jour." });
                toast.error(err.message || "Erreur de mise à jour");
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
        { title: "Équipe", icon: '👥', path: ADMIN_TEAM },
        { title: 'Projets', icon: '📁', path: ADMIN_PROJECTS },
        { title: 'Contenu', icon: '✍️', path: ADMIN_CONTENT },
        { title: 'Blog', icon: '🖼️', path: ADMIN_BLOG },
        { title: 'Inbox', icon: '📨', path: ADMIN_INBOX },
        { title: 'Services', icon: '🛠️', path: ADMIN_SERVICES, active: true },
    ];

    const getCategoryName = (category: string) => {
        switch (category) {
            case 'A': return 'Branding & Design';
            case 'B': return 'Web & Mobile';
            case 'C': return 'Digital Marketing';
            default: return category;
        }
    };

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
                        <h1 className="text-4xl md:text-5xl font-black text-[#010E26] uppercase font-bodoni mb-2">Gestion des Services</h1>
                        <p className="text-gray-500 font-medium">Ajoutez, modifiez ou supprimez les services que Landmark propose à ses clients.</p>
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="bg-[#445EF2] text-white px-8 py-4 rounded-2xl hover:bg-[#010E26] transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-[#445EF2]/20 flex items-center gap-2 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        Nouveau Service
                    </button>
                </div>

                {errors.general && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold uppercase text-[10px] tracking-widest animate-pulse">
                        {errors.general}
                    </div>
                )}

                {/* Forms Section */}
                <AnimatePresence mode="wait">
                    {(showCreateForm || showUpdateForm) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-12">
                            <div className={`p-8 md:p-10 rounded-[2.5rem] border ${showUpdateForm ? 'bg-indigo-50/50 border-indigo-100' : 'bg-gray-50/50 border-gray-100'}`}>
                                <h2 className="text-2xl font-black text-[#010E26] uppercase mb-8">
                                    {showCreateForm ? 'Créer un nouveau service' : `Mettre à jour: ${serviceToEdit?.title}`}
                                </h2>
                                <form onSubmit={showCreateForm ? handleCreateSubmit : handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Titre du Service *</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all" />
                                        {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.title[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Catégorie *</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all appearance-none cursor-pointer">
                                            <option value="A">Branding & Design</option>
                                            <option value="B">Web & Mobile</option>
                                            <option value="C">Digital Marketing</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description *</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={4} className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all" />
                                        {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.description[0]}</p>}
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Photo {showCreateForm ? '*' : '(optionnel)'}</label>
                                        {formData.currentImage && showUpdateForm && !formData.image && (
                                            <div className="mb-2 ml-1">
                                                <p className="text-gray-400 text-[10px] uppercase font-bold mb-2">Image actuelle:</p>
                                                <img src={`https://api.Landmark.ma/storage/${formData.currentImage}`} className="h-16 w-16 object-cover rounded-xl border border-gray-100" alt="Current" />
                                            </div>
                                        )}
                                        <input type="file" name="image" onChange={handleInputChange} accept="image/*" required={showCreateForm} className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-100 file:text-[#010E26] hover:file:bg-[#445EF2] hover:file:text-white file:transition-all" />
                                        {errors.image && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.image[0]}</p>}
                                    </div>
                                    <div className="md:col-span-2 flex gap-4 pt-4">
                                        <button disabled={isSubmitting} type="submit" className="flex-1 bg-[#445EF2] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#010E26] transition-all disabled:opacity-50">
                                            {isSubmitting ? 'Publication en cours...' : showCreateForm ? 'Publier le service' : 'Mettre à jour le service'}
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

                {/* Services Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#445EF2] rounded-full animate-spin mb-6"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Analyse de vos services...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services && services.length > 0 ? (
                            services.map((service: any) => (
                                <motion.div layout key={service.id} className="group bg-white rounded-[2.5rem] p-6 border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.05)] transition-all flex flex-col h-full">
                                    <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-6 bg-gray-100">
                                        {service.image ? (
                                            <img src={`https://api.Landmark.ma/storage/${service.image}`} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-300 font-black uppercase text-[10px]">No Thumbnail</div>
                                        )}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                                            <button onClick={() => handleEditClick(service)} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#010E26] hover:bg-[#445EF2] hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg></button>
                                            <button onClick={() => handleDeleteClick(service)} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <span className={`font-black uppercase text-[10px] tracking-[0.2em] mb-2 inline-block px-3 py-1 rounded-lg ${service.category === 'A' ? 'bg-blue-50 text-blue-600' : service.category === 'B' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {getCategoryName(service.category)}
                                        </span>
                                        <h3 className="text-xl font-bold text-[#010E26] uppercase mb-3 line-clamp-1">{service.title}</h3>
                                        <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">{service.description}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Aucun service actuellement listé</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg></div>
                            <h3 className="text-2xl font-black text-[#010E26] uppercase mb-4">Supprimer le Service</h3>
                            <p className="text-gray-500 font-medium mb-1">Voulez-vous vraiment retirer</p>
                            <p className="text-[#010E26] font-black uppercase text-lg mb-8">"{serviceToDelete?.title}" ?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowDeleteModal(false)} disabled={isDeleting} className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px]">Conserver</button>
                                <button onClick={handleConfirmDelete} disabled={isDeleting} className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200">
                                    {isDeleting ? 'Retrait...' : 'Supprimer'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
