"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import mainLogo from "@/assets/logotype/main.png";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { api } from "@/services/api";

// Route constants
const ADMIN_TEAM = "/admin/team";
const ADMIN_PROJECTS = "/admin/projects";
const ADMIN_BLOG = "/admin/blog";
const ADMIN_CONTENT = "/admin/content";
const ADMIN_SERVICES = "/admin/services";

const formatViews = (views: any) => {
	if (!views) return "0 vues";
	const num = parseInt(views);
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M vues`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}K vues`;
	return `${num} vues`;
};

export default function ContentManagementPage() {
	const [contents, setContents] = useState<any>([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [contentToDelete, setContentToDelete] = useState<any>(null);
	const [contentToEdit, setContentToEdit] = useState<any>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState<any>({});
	const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
	const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

	const [formData, setFormData] = useState<any>({
		title: "",
		views: "",
		video: null,
		thumbnail: null,
	});

	const router = useRouter();

	useEffect(() => {
		document.title = "Gestion des Reels | Landmark Administration";
		fetchContents();
	}, []);

	const fetchContents = async () => {
		setIsLoading(true);
		try {
			const data = await api.content.getAll();
			setContents(data);
		} catch (err) {
			console.error("Erreur lors de la récupération des contenus:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteClick = (content: any) => {
		setContentToDelete(content);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!contentToDelete) return;

		setIsDeleting(true);
		try {
			await api.content.delete(contentToDelete.id);
			toast.success("Contenu supprimé avec succès");
			fetchContents();
			setShowDeleteModal(false);
			setContentToDelete(null);
		} catch (err: any) {
			console.error(err.message || "Erreur de suppression");
			toast.error(err.message || "Erreur lors de la suppression");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCreateClick = () => {
		setFormData({ title: "", views: "", video: null, thumbnail: null });
		setErrors({});
		setShowCreateForm(true);
		setShowUpdateForm(false);
	};

	const handleEditClick = (content: any) => {
		setContentToEdit(content);
		setFormData({
			title: content.title,
			views: content.views,
			video: null,
			thumbnail: null,
		});
		setErrors({});
		setShowUpdateForm(true);
		setShowCreateForm(false);
	};

	const handleInputChange = (e: any) => {
		const { name, value, type, files } = e.target;
		if (type === "file") {
			setFormData((prev: any) => ({ ...prev, [name]: files[0] }));
		} else {
			setFormData((prev: any) => ({ ...prev, [name]: value }));
		}
	};

	const handleCreateSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrors({});

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("title", formData.title);
			formDataToSend.append("views", formData.views);

			if (formData.video) formDataToSend.append("video", formData.video);
			if (formData.thumbnail)
				formDataToSend.append("thumbnail", formData.thumbnail);

			await api.content.create(formDataToSend);

			fetchContents();
			setShowCreateForm(false);
			toast.success("Reel publié avec succès");
		} catch (err: any) {
			if (err.errors) {
				setErrors(err.errors);
			} else {
				setErrors({ message: err.message || "Échec de la création !" });
				toast.error(err.message || "Échec de la création");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!contentToEdit) return;

		setIsSubmitting(true);
		setErrors({});

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("title", formData.title);
			formDataToSend.append("views", formData.views);
			formDataToSend.append("_method", "PUT");

			if (formData.video) formDataToSend.append("video", formData.video);
			if (formData.thumbnail)
				formDataToSend.append("thumbnail", formData.thumbnail);

			await api.content.update(contentToEdit.id, formDataToSend);

			fetchContents();
			setShowUpdateForm(false);
			toast.success("Reel mis à jour");
		} catch (err: any) {
			if (err.errors) {
				setErrors(err.errors);
			} else {
				setErrors({ message: err.message || "Échec de la mise à jour !" });
				toast.error(err.message || "Échec de la mise à jour");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const togglePlayVideo = (contentId: number) => {
		if (playingVideoId === contentId) {
			if (videoRefs.current[contentId]) videoRefs.current[contentId].pause();
			setPlayingVideoId(null);
		} else {
			if (playingVideoId && videoRefs.current[playingVideoId])
				videoRefs.current[playingVideoId].pause();
			if (videoRefs.current[contentId]) {
				videoRefs.current[contentId]
					.play()
					.then(() => setPlayingVideoId(contentId))
					.catch(console.error);
			}
		}
	};

	const handleLogout = async () => {
		await api.logout().catch(() => null);
		router.push("/");
	};

	const navigateTo = (path: string) => router.push(path);

	const adminCards = [
		{ title: "Équipe", icon: "👥", path: ADMIN_TEAM },
		{ title: "Projets", icon: "📁", path: ADMIN_PROJECTS },
		{ title: "Contenu", icon: "✍️", path: ADMIN_CONTENT, active: true },
		{ title: "Blog", icon: "🖼️", path: ADMIN_BLOG },
		{ title: "Services", icon: "🛠️", path: ADMIN_SERVICES },
	];

	return (
		<div className="font-jost bg-[#fcfdfe] min-h-screen pb-20 overflow-x-hidden">
			{/* Navigtaion Bar */}
			<nav className="bg-white border-b border-gray-100 sticky top-0 z-30 h-24 flex items-center">
				<div className="max-w-7xl mx-auto px-6 lg:px-10 w-full flex justify-between items-center">
					<Link href="/admin">
						<Image
							src={mainLogo}
							alt="Landmark"
							className="h-10 md:h-12 w-auto object-contain"
							priority
						/>
					</Link>
					<button
						onClick={handleLogout}
						className="bg-[#010E26] text-white px-6 py-3 rounded-2xl hover:bg-[#445EF2] transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#010E26]/10 active:scale-95"
					>
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
							className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${card.active ? "bg-[#010E26] text-white shadow-xl shadow-[#010E26]/20" : "bg-white text-gray-400 border border-gray-100 hover:border-[#445EF2] hover:text-[#445EF2]"}`}
						>
							<span className="mr-2">{card.icon}</span> {card.title}
						</button>
					))}
				</div>

				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
					<div>
						<h1 className="text-4xl md:text-5xl font-black text-[#010E26] uppercase font-bodoni mb-2">
							Gestion des Reels
						</h1>
						<p className="text-gray-500 font-medium">
							Gérez vos contenus vidéo et reels pour captiver votre audience.
						</p>
					</div>
					<button
						onClick={handleCreateClick}
						className="bg-[#445EF2] text-white px-8 py-4 rounded-2xl hover:bg-[#010E26] transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-[#445EF2]/20 flex items-center gap-2 active:scale-95"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={3}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Nouveau Reel
					</button>
				</div>

				{errors.message && (
					<div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold uppercase text-[10px] tracking-widest">
						{errors.message}
					</div>
				)}

				{/* Forms Section */}
				<AnimatePresence mode="wait">
					{(showCreateForm || showUpdateForm) && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="overflow-hidden mb-12"
						>
							<div
								className={`p-8 md:p-10 rounded-[2.5rem] border ${showUpdateForm ? "bg-amber-50/50 border-amber-100" : "bg-gray-50/50 border-gray-100"}`}
							>
								<h2 className="text-2xl font-black text-[#010E26] uppercase mb-8">
									{showCreateForm
										? "Créer un nouveau Reel"
										: `Modifier Reel: ${contentToEdit?.title}`}
								</h2>
								<form
									onSubmit={
										showCreateForm ? handleCreateSubmit : handleUpdateSubmit
									}
									className="grid grid-cols-1 md:grid-cols-2 gap-6"
								>
									<div className="space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Titre du Reel *
										</label>
										<input
											type="text"
											name="title"
											value={formData.title}
											onChange={handleInputChange}
											required
											className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all"
										/>
										{errors.title && (
											<p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
												{errors.title[0]}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Vues simulées *
										</label>
										<input
											type="number"
											name="views"
											value={formData.views}
											onChange={handleInputChange}
											required
											className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all"
										/>
										{errors.views && (
											<p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
												{errors.views[0]}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Fichier Vidéo {showCreateForm ? "*" : "(optionnel)"}
										</label>
										<input
											type="file"
											name="video"
											onChange={handleInputChange}
											accept="video/*"
											required={showCreateForm}
											className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-100 file:text-[#010E26] hover:file:bg-[#445EF2] hover:file:text-white file:transition-all"
										/>
										{errors.video && (
											<p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
												{errors.video[0]}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Miniature {showCreateForm ? "*" : "(optionnel)"}
										</label>
										<input
											type="file"
											name="thumbnail"
											onChange={handleInputChange}
											accept="image/*"
											required={showCreateForm}
											className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-100 file:text-[#010E26] hover:file:bg-[#445EF2] hover:file:text-white file:transition-all"
										/>
										{errors.thumbnail && (
											<p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
												{errors.thumbnail[0]}
											</p>
										)}
									</div>
									<div className="md:col-span-2 flex gap-4 pt-4">
										<button
											disabled={isSubmitting}
											type="submit"
											className="flex-1 bg-[#445EF2] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#010E26] transition-all disabled:opacity-50"
										>
											{isSubmitting
												? "Traitement Media..."
												: showCreateForm
													? "Publier le Reel"
													: "Enregistrer les modifications"}
										</button>
										<button
											onClick={() => {
												setShowCreateForm(false);
												setShowUpdateForm(false);
											}}
											type="button"
											className="px-8 bg-white text-gray-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-gray-100 hover:border-red-500 hover:text-red-500 transition-all"
										>
											Annuler
										</button>
									</div>
								</form>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Content Grid */}
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-32">
						<div className="w-12 h-12 border-4 border-gray-100 border-t-[#445EF2] rounded-full animate-spin mb-6"></div>
						<p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
							Chargement de la bibliothèque...
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{contents.data?.map((content: any) => (
							<motion.div
								layout
								key={content.id}
								className="group flex flex-col h-full"
							>
								<div className="relative aspect-9/16 w-full rounded-[2.5rem] overflow-hidden bg-black shadow-xl shadow-black/10">
									<video
										ref={(el) => {
											videoRefs.current[content.id] = el;
										}}
										src={`https://api.Landmark.ma/storage/${content.video}`}
										className={`absolute h-full w-full object-cover ${playingVideoId === content.id ? "opacity-100" : "opacity-0"}`}
										onClick={() => togglePlayVideo(content.id)}
										onEnded={() => setPlayingVideoId(null)}
										playsInline
									/>
									{playingVideoId !== content.id && (
										<>
											{content.thumbnail ? (
												<img
													src={`https://api.Landmark.ma/storage/${content.thumbnail}`}
													alt={content.title}
													className="absolute h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
												/>
											) : (
												<div className="absolute inset-0 flex items-center justify-center text-gray-700 font-black uppercase text-[10px]">
													No Poster
												</div>
											)}
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
											<button
												onClick={() => togglePlayVideo(content.id)}
												className="absolute inset-0 flex items-center justify-center pointer-events-auto"
											>
												<div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-2xl">
													<svg
														className="w-8 h-8 ml-1"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path d="M8 5v14l11-7z" />
													</svg>
												</div>
											</button>
										</>
									)}
									<div className="absolute top-6 right-6 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
										<button
											onClick={() => handleEditClick(content)}
											className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-[#010E26] hover:bg-[#445EF2] hover:text-white transition-all"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
												/>
											</svg>
										</button>
										<button
											onClick={() => handleDeleteClick(content)}
											className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</div>
									<div className="absolute bottom-8 left-8 right-8 pointer-events-none">
										<h3 className="text-white font-bold uppercase text-lg leading-tight mb-2 line-clamp-2">
											{content.title}
										</h3>
										<div className="flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest">
											<svg
												className="w-3 h-3"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={3}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											{formatViews(content.views)}
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>

			{/* Delete Modal */}
			<AnimatePresence>
				{showDeleteModal && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-6">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center"
						>
							<div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
								<svg
									className="w-10 h-10"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-black text-[#010E26] uppercase mb-4">
								Supprimer le Reel
							</h3>
							<p className="text-gray-500 font-medium mb-1">
								Attention, action irréversible sur:
							</p>
							<p className="text-[#010E26] font-black uppercase text-lg mb-8">
								"{contentToDelete?.title}" ?
							</p>
							<div className="grid grid-cols-2 gap-4">
								<button
									onClick={() => setShowDeleteModal(false)}
									className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px]"
								>
									Conserver
								</button>
								<button
									onClick={handleConfirmDelete}
									className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200"
								>
									{isDeleting ? "Suppression..." : "Supprimer"}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
