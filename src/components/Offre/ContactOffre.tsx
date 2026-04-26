'use client';

import { useState, useCallback, useMemo, memo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import Image from 'next/image';
import phoneImage from '@/assets/Landing/phone.png';
import IconEmail from '@/assets/Landing/IconEmailI.png';
import IconLocation from '@/assets/Landing/IconLocation.png';
import IconWhatsapp from '@/assets/Landing/IconWhatsapp.png';
import { JSX } from 'react/jsx-runtime';

interface FormData {
    project_name: string;
    full_name: string;
    phone_number: string;
    service_type: string;
}

interface ServiceOption {
    value: string;
    label: string;
    color: string;
}

interface SubmitStatus {
    success: boolean;
    message: string;
}

interface FormErrors {
    project_name?: string;
    full_name?: string;
    phone_number?: string;
    service_type?: string;
}

const ContactOffre = memo(function ContactOffre(): JSX.Element {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        project_name: '',
        full_name: '',
        phone_number: '',
        service_type: '',
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const serviceOptions = useMemo<ServiceOption[]>(() => [
        { value: '1 video 950dh', label: '1 vidéo à 950 Dh', color: '#05C7F2' },
        { value: '4 videos 2800dh', label: '4 vidéos à 2800 Dh', color: '#445EF2' },
        { value: '6 videos 3900dh', label: '6 videos à 3900 Dh', color: '#263973' },
        { value: 'or more videos', label: 'Plus de vidéos', color: '#7585A0' },
    ], []);

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);

    const checkAndSetPackage = useCallback((openDropdown = false): boolean => {
        const storedPackage = sessionStorage.getItem('selectedPackage');
        if (storedPackage) {
            try {
                const packageInfo = JSON.parse(storedPackage);
                const serviceValue: string = packageInfo.serviceValue || packageInfo.displayText;
                if (serviceValue) {
                    setFormData(prev => {
                        if (prev.service_type !== serviceValue) {
                            return { ...prev, service_type: serviceValue };
                        }
                        return prev;
                    });
                    setErrors(prev => {
                        if (prev.service_type) return { ...prev, service_type: '' };
                        return prev;
                    });
                    if (openDropdown) {
                        setIsDropdownOpen(true);
                        setTimeout(() => setIsDropdownOpen(false), 1500);
                    }
                    sessionStorage.removeItem('selectedPackage');
                    return true;
                }
            } catch (error) {
                console.error('Error parsing stored package:', error);
            }
        }
        return false;
    }, [serviceOptions]);

    useEffect(() => {
        checkAndSetPackage(true);

        const fallbackInterval = setInterval(() => {
            const wasSet = checkAndSetPackage(false);
            if (wasSet) clearInterval(fallbackInterval);
        }, 800);

        const contactSection = document.getElementById('contact-offre');
        if (contactSection && typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                const wasSet = checkAndSetPackage(true);
                                if (!wasSet) {
                                    setTimeout(() => checkAndSetPackage(true), 500);
                                } else {
                                    clearInterval(fallbackInterval);
                                }
                            }, 200);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            observer.observe(contactSection);
            return () => {
                observer.disconnect();
                clearInterval(fallbackInterval);
            };
        }

        return () => clearInterval(fallbackInterval);
    }, [checkAndSetPackage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleServiceSelect = useCallback((value: string): void => {
        setFormData(prev => ({ ...prev, service_type: value }));
        setIsDropdownOpen(false);
        setErrors(prev => {
            if (prev.service_type) return { ...prev, service_type: '' };
            return prev;
        });
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => {
            if (prev[name as keyof FormErrors]) return { ...prev, [name]: '' };
            return prev;
        });
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrors({});
        setSubmitStatus(null);
        setIsSubmitting(true);
        setShowSuccessScreen(false);

        const newErrors: FormErrors = {};
        if (!formData.project_name.trim()) newErrors.project_name = 'اسم المشروع مطلوب';
        if (!formData.full_name.trim()) newErrors.full_name = 'الاسم مطلوب';
        if (!formData.phone_number.trim()) newErrors.phone_number = 'رقم الهاتف مطلوب';
        if (!formData.service_type.trim()) newErrors.service_type = 'نوع الخدمة مطلوب';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        try {
            if (!serviceId) throw new Error('EmailJS Service ID غير مُعرّف');
            if (!templateId) throw new Error('EmailJS Template ID غير مُعرّف');
            if (!publicKey) throw new Error('EmailJS Public Key غير مُعرّف');

            const templateParams = {
                to_email: 'contact.landmarkagency@gmail.com',
                from_name: formData.full_name,
                project_name: formData.project_name,
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                service_type: formData.service_type,
                message: `طلب جديد من موقع لاندمارك:\n\n📋 اسم المشروع: ${formData.project_name}\n👤 الاسم الكامل: ${formData.full_name}\n📱 رقم الهاتف: ${formData.phone_number}\n🎯 نوع الخدمة: ${formData.service_type}`,
                reply_to: formData.phone_number,
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            setFormData({ project_name: '', full_name: '', phone_number: '', service_type: '' });
            setShowSuccessScreen(true);
        } catch (error: unknown) {
            console.error('EmailJS Error:', error);
            setSubmitStatus({
                success: false,
                message: 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData]);

    const handleNavigateHome = useCallback((): void => {
        router.push('/');
    }, [router]);

    return (
        <div id="contact-offre" className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Header */}
                <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-500 ${showSuccessScreen ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                    <h2
                        className="text-2xl sm:text-3xl text-center md:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 md:mb-16"
                        style={{ fontFamily: 'var(--font-jenine)' }}
                    >
                        خلي لينا المعلومات ديالك
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-white" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                        وفريق لاند مارك يتواصل معاك فقل من 24 ساعة
                    </p>
                </div>

                {/* Two Column Layout */}
                {!showSuccessScreen && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 text-right gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-12 sm:mb-16 md:mb-20 items-center">
                        {/* Phone Image */}
                        <div className="flex items-center justify-center lg:justify-start order-2 lg:order-1">
                            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                                <Image src={phoneImage} alt="Phones" className="w-full h-auto object-contain" />
                            </div>
                        </div>

                        {/* Form */}
                        <div className="order-1 lg:order-2 relative min-h-[400px]">
                            <div className="bg-[#0a1a3a] rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 relative">
                                <p
                                    className="text-white text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8"
                                    style={{ fontFamily: 'var(--font-jenine)' }}
                                >
                                    كتب لينا شنو محتاج وغادي نخدمو معاك على خطة واضحة لصناعة المحتوى
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Project Name */}
                                        <div>
                                            <label htmlFor="project_name" className="block text-white text-sm sm:text-base mb-2" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                                                اسم مشروعك
                                            </label>
                                            <input
                                                type="text"
                                                id="project_name"
                                                name="project_name"
                                                value={formData.project_name}
                                                onChange={handleChange}
                                                className="w-full placeholder:text-right px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                                style={{ fontFamily: 'var(--font-madani-regular)' }}
                                                placeholder="اسم مشروعك"
                                            />
                                            {errors.project_name && <p className="text-red-400 text-xs mt-1">{errors.project_name}</p>}
                                        </div>

                                        {/* Full Name */}
                                        <div>
                                            <label htmlFor="full_name" className="block text-white text-sm sm:text-base mb-2" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                                                الإسم و النسب
                                            </label>
                                            <input
                                                type="text"
                                                id="full_name"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                className="w-full placeholder:text-right px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                                style={{ fontFamily: 'var(--font-madani-regular)' }}
                                                placeholder="الإسم و النسب"
                                            />
                                            {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label htmlFor="phone_number" className="block text-white text-sm sm:text-base mb-2" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                                            رقم الهاتف
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone_number"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className="w-full placeholder:text-right px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                            style={{ fontFamily: 'var(--font-madani-regular)' }}
                                            placeholder="رقم الهاتف"
                                        />
                                        {errors.phone_number && <p className="text-red-400 text-xs mt-1">{errors.phone_number}</p>}
                                    </div>

                                    {/* Service Type Dropdown */}
                                    <div ref={dropdownRef} className="relative">
                                        <label htmlFor="service_type" className="block text-white text-sm sm:text-base mb-2" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                                            نوع العرض او الخدمة
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!isDropdownOpen) checkAndSetPackage(false);
                                                setIsDropdownOpen(!isDropdownOpen);
                                            }}
                                            className={`w-full text-right px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all flex items-center justify-between gap-3 ${errors.service_type ? 'ring-2 ring-red-400' : ''}`}
                                            style={{ fontFamily: 'var(--font-madani-regular)' }}
                                        >
                                            <div className="flex items-center gap-3 flex-1 justify-end">
                                                {formData.service_type && (() => {
                                                    const selected = serviceOptions.find(opt => opt.value === formData.service_type);
                                                    return selected ? (
                                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" fill={selected.color} />
                                                            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    ) : null;
                                                })()}
                                                <span className={!formData.service_type ? 'text-gray-400' : ''}>
                                                    {formData.service_type
                                                        ? serviceOptions.find(opt => opt.value === formData.service_type)?.label || formData.service_type
                                                        : 'اختر نوع العرض او الخدمة'}
                                                </span>
                                            </div>
                                            <svg
                                                className={`w-5 h-5 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-h-64 overflow-y-auto">
                                                {serviceOptions.map((option) => {
                                                    const isSelected = formData.service_type === option.value;
                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => handleServiceSelect(option.value)}
                                                            className={`w-full cursor-pointer text-right px-4 py-3 transition-colors flex items-center justify-between gap-3 ${isSelected ? 'bg-cyan-50' : 'hover:bg-gray-100'}`}
                                                            style={{ fontFamily: 'var(--font-madani-regular)' }}
                                                        >
                                                            <span className="flex-1 text-gray-800">{option.label}</span>
                                                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="12" r="10" fill={option.color} />
                                                                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {errors.service_type && <p className="text-red-400 text-xs mt-1">{errors.service_type}</p>}
                                    </div>

                                    {/* Submit */}
                                    <div className="flex justify-center pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full cursor-pointer sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ fontFamily: 'var(--font-madani-bold)' }}
                                        >
                                            {isSubmitting ? 'جاري الإرسال...' : 'تأكيد طلبي'}
                                        </button>
                                    </div>

                                    {submitStatus && !submitStatus.success && (
                                        <div className="text-center p-4 rounded-lg bg-red-500/20 text-red-400">
                                            <p style={{ fontFamily: 'var(--font-madani-regular)' }}>{submitStatus.message}</p>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Screen */}
                {showSuccessScreen && (
                    <div className="flex items-center justify-center min-h-[60vh] mb-12 sm:mb-16 md:mb-20">
                        <div className="w-full max-w-2xl mx-auto animate-fade-in">
                            <div className="bg-[#0a1a3a] rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 relative">
                                <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
                                    <div className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce-in">
                                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-check-draw" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-400 animate-slide-up" style={{ fontFamily: 'var(--font-jenine)' }}>
                                            !شكراً لتواصلك معنا
                                        </h3>
                                        <p className="text-white text-lg sm:text-xl md:text-2xl animate-slide-up-delay" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                                            تم إرسال طلبك بنجاح
                                        </p>
                                        <p className="text-gray-300 text-base sm:text-lg animate-slide-up-delay" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                                            سنتواصل معك في أقل من 24 ساعة
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleNavigateHome}
                                        className="px-8 sm:px-12 cursor-pointer py-3 sm:py-4 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-400/50 animate-slide-up-delay-2"
                                        style={{ fontFamily: 'var(--font-madani-bold)' }}
                                    >
                                        العودة إلى الصفحة الرئيسية
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 transition-all duration-500 ${showSuccessScreen ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4">
                            <Image src={IconEmail} alt="Email" className="w-12 h-12 sm:w-16 sm:h-16" />
                        </div>
                        <a href="mailto:contanct.landmarkagency@gmail.com" className="text-white text-sm sm:text-base hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                            contanct.landmarkagency@gmail.com
                        </a>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4">
                            <Image src={IconWhatsapp} alt="WhatsApp" className="w-12 h-12 sm:w-16 sm:h-16" />
                        </div>
                        <a href="https://wa.me/212710220010" target="_blank" rel="noopener noreferrer" className="text-white text-sm sm:text-base hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                            +212710-220010
                        </a>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                            <Image src={IconLocation} alt="Location" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-white text-sm sm:text-base" style={{ fontFamily: 'var(--font-madani-regular)' }}>
                            Hay Alqods - Immeuble Maroc Telecom 2ème étage, Oujda
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes checkDraw { 0% { stroke-dasharray: 0 20; } 100% { stroke-dasharray: 20 0; stroke-dashoffset: -20; } }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-bounce-in { animation: bounceIn 0.8s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out 0.3s both; }
                .animate-slide-up-delay { animation: slideUp 0.6s ease-out 0.5s both; }
                .animate-slide-up-delay-2 { animation: slideUp 0.6s ease-out 0.7s both; }
                .animate-check-draw { animation: checkDraw 0.6s ease-out 0.4s both; stroke-dasharray: 20; stroke-dashoffset: 20; }
            `}</style>
        </div>
    );
});

export default ContactOffre;
