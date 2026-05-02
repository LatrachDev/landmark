"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import mainLogo from "@/assets/logotype/main.png";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { api } from "@/services/api";
import type { Project } from "@/types/project";

const ADMIN_TEAM = "/admin/team";
const ADMIN_INBOX = "/admin/inbox";
const ADMIN_PROJECTS = "/admin/projects";
const ADMIN_BLOG = "/admin/blog";
const ADMIN_CONTENT = "/admin/content";
const ADMIN_SERVICES = "/admin/services";

interface FormState {
	title: string;
	description: string;
	views: number;
	thumbnailImage: File | null;
	landingImage: File | null;
}

const emptyForm = (): FormState => ({
	title: "",
	description: "",
	views: 0,
	thumbnailImage: null,
	landingImage: null,
});

export default function ProjectsManagementPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
	const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState<string[]>([]);

	const [formData, setFormData] = useState<FormState>(emptyForm());

	const router = useRouter();

	useEffect(() => {
		document.title = "Gestion des Projets | Landmark Administration";
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		setIsLoading(true);
		try {
			const data = await api.projects.getAll();
			setProjects(data);
		} catch (err) {
			console.error("Error fetching projects:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteClick = (project: Project) => {
		setProjectToDelete(project);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!projectToDelete) return;
		setIsDeleting(true);
		try {
			await api.projects.delete(projectToDelete.id);
			toast.success("Projet supprimé avec succès");
			fetchProjects();
			setShowDeleteModal(false);
			setProjectToDelete(null);
		} catch (err: unknown) {
			const msg =
				err instanceof Error ? err.message : "Échec de la suppression";
			toast.error(msg);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCreateClick = () => {
		setFormData(emptyForm());
		setErrors([]);
		setShowCreateForm(true);
		setShowUpdateForm(false);
	};

	const handleEditClick = (project: Project) => {
		setProjectToEdit(project);
		setFormData({
			title: project.title,
			description: project.description,
			views: project.views,
			thumbnailImage: null,
			landingImage: null,
		});
		setErrors([]);
		setShowUpdateForm(true);
		setShowCreateForm(false);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const target = e.target as HTMLInputElement;
		const { name, value, type } = target;
		if (type === "file") {
			setFormData((prev) => ({ ...prev, [name]: target.files?.[0] ?? null }));
		} else if (type === "range" || type === "number") {
			setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleCreateSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrors([]);

		const fd = new FormData();
		fd.append("title", formData.title);
		fd.append("description", formData.description);
		fd.append("views", formData.views.toString());
		if (formData.thumbnailImage)
			fd.append("thumbnailImage", formData.thumbnailImage);
		if (formData.landingImage) fd.append("landingImage", formData.landingImage);

		try {
			await api.projects.create(fd);
			fetchProjects();
			setShowCreateForm(false);
			toast.success("Nouveau projet publié");
		} catch (err: unknown) {
			const body = err as { errors?: string[]; message?: string };
			if (body?.errors) {
				setErrors(body.errors);
			} else {
				toast.error(body?.message || "Erreur lors de la création");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!projectToEdit) return;
		setIsSubmitting(true);
		setErrors([]);

		const fd = new FormData();
		fd.append("title", formData.title);
		fd.append("description", formData.description);
		fd.append("views", formData.views.toString());
		if (formData.thumbnailImage)
			fd.append("thumbnailImage", formData.thumbnailImage);
		if (formData.landingImage) fd.append("landingImage", formData.landingImage);

		try {
			await api.projects.update(projectToEdit.id, fd);
			fetchProjects();
			setShowUpdateForm(false);
			toast.success("Projet mis à jour avec succès");
		} catch (err: unknown) {
			const body = err as { errors?: string[]; message?: string };
			if (body?.errors) {
				setErrors(body.errors);
			} else {
				toast.error(body?.message || "Erreur lors de la mise à jour");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleLogout = async () => {
		await api.logout().catch(() => null);
		router.push("/");
	};

	const navigateTo = (path: string) => router.push(path);

	const adminCards = [
		{ title: "Équipe", icon: "👥", path: ADMIN_TEAM },
		{ title: "Projets", icon: "📁", path: ADMIN_PROJECTS, active: true },
		{ title: "Contenu", icon: "✍️", path: ADMIN_CONTENT },
		{ title: "Blog", icon: "🖼️", path: ADMIN_BLOG },
		{ title: "Inbox", icon: "📨", path: ADMIN_INBOX },
		{ title: "Services", icon: "🛠️", path: ADMIN_SERVICES },
	];

	return (
		<div className="font-jost bg-[#fcfdfe] min-h-screen pb-20 overflow-x-hidden">
			{/* Navigation Bar */}
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
							Gestion des Projets
						</h1>
						<p className="text-gray-500 font-medium">
							Répertoriez vos plus belles réalisations et portfolios.
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
						Nouveau Projet
					</button>
				</div>

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
								className={`p-8 md:p-10 rounded-[2.5rem] border ${showUpdateForm ? "bg-indigo-50/50 border-indigo-100" : "bg-gray-50/50 border-gray-100"}`}
							>
								<h2 className="text-2xl font-black text-[#010E26] uppercase mb-8">
									{showCreateForm
										? "Créer un nouveau projet"
										: `Modifier: ${projectToEdit?.title}`}
								</h2>

								{errors.length > 0 && (
									<ul className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 space-y-1">
										{errors.map((err, i) => (
											<li
												key={i}
												className="text-red-600 text-[11px] font-bold uppercase tracking-wider"
											>
												{err}
											</li>
										))}
									</ul>
								)}

								<form
									onSubmit={
										showCreateForm ? handleCreateSubmit : handleUpdateSubmit
									}
									className="grid grid-cols-1 md:grid-cols-2 gap-6"
								>
									<div className="space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Titre du Projet *
										</label>
										<input
											type="text"
											name="title"
											value={formData.title}
											onChange={handleInputChange}
											required
											className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Impact / Vues ({formData.views}%)
										</label>
										<input
											type="range"
											name="views"
											value={formData.views}
											min="0"
											max="100"
											onChange={handleInputChange}
											className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#445EF2] mt-4"
										/>
									</div>
									<div className="md:col-span-2 space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Description *
										</label>
										<textarea
											name="description"
											value={formData.description}
											onChange={handleInputChange}
											required
											rows={3}
											className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Thumbnail {showCreateForm ? "*" : "(optionnel)"}
										</label>
										<input
											type="file"
											name="thumbnailImage"
											onChange={handleInputChange}
											accept="image/jpeg,image/png,image/webp,image/gif"
											required={showCreateForm}
											className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-100 file:text-[#010E26] hover:file:bg-[#445EF2] hover:file:text-white file:transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-[#010E26] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
											Landing Photo {showCreateForm ? "*" : "(optionnel)"}
										</label>
										<input
											type="file"
											name="landingImage"
											onChange={handleInputChange}
											accept="image/jpeg,image/png,image/webp,image/gif"
											required={showCreateForm}
											className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-[#445EF2] outline-none shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-100 file:text-[#010E26] hover:file:bg-[#445EF2] hover:file:text-white file:transition-all"
										/>
									</div>
									<div className="md:col-span-2 flex gap-4 pt-4">
										<button
											disabled={isSubmitting}
											type="submit"
											className="flex-1 bg-[#445EF2] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#010E26] transition-all disabled:opacity-50"
										>
											{isSubmitting
												? "Enregistrement..."
												: showCreateForm
													? "Lancer le Projet"
													: "Mettre à jour le Projet"}
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

				{/* Projects Grid */}
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-32">
						<div className="w-12 h-12 border-4 border-gray-100 border-t-[#445EF2] rounded-full animate-spin mb-6"></div>
						<p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
							Chargement de vos réalisations...
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{projects.map((project) => (
							<motion.div
								layout
								key={project.id}
								className="group bg-white rounded-[2.5rem] p-6 border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.05)] transition-all flex flex-col h-full"
							>
								<div className="relative aspect-video w-full rounded-4xl overflow-hidden mb-6 bg-gray-100">
									<img
										src={project.thumbnailUrl}
										alt={project.title}
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
										<button
											onClick={() => handleEditClick(project)}
											className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#010E26] hover:bg-[#445EF2] hover:text-white transition-all"
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
											onClick={() => handleDeleteClick(project)}
											className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
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
									<div className="absolute bottom-4 left-4">
										<span className="bg-white/90 backdrop-blur-sm text-[#445EF2] text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow-sm">
											{project.views}% impact
										</span>
									</div>
								</div>
								<div className="grow">
									<h3 className="text-xl font-bold text-[#010E26] uppercase mb-3 line-clamp-1">
										{project.title}
									</h3>
									<p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed mb-6">
										{project.description}
									</p>
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
								Retirer ce projet ?
							</h3>
							<p className="text-gray-500 font-medium mb-1">
								Confirmez-vous la suppression de
							</p>
							<p className="text-[#010E26] font-black uppercase text-lg mb-8">
								"{projectToDelete?.title}" ?
							</p>
							<div className="grid grid-cols-2 gap-4">
								<button
									onClick={() => setShowDeleteModal(false)}
									className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px]"
								>
									Garder
								</button>
								<button
									onClick={handleConfirmDelete}
									className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200"
								>
									{isDeleting ? "Suppression..." : "Confirmer"}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
