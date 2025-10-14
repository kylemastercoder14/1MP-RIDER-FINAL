/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/date-picker";
import CustomizedInput from "@/components/customized-input";
import CustomizedSelect from "@/components/customized-select";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Camera,
  Check,
  CircleCheck,
  FolderUp,
  LogOut,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/lib/upload-s3";
import { Modal } from "@/components/modal";
import { Toast, ToastType } from "@/components/toast-notification";
import AlertModal from "@/components/ui/alert-modal";
import Link from "next/link";
import { onboardRider, signOut } from "@/actions";
import { Rider } from "@prisma/client";

const vehicleTypeOptions = [
  {
    value: "motorcycle",
    label: "Motorcycle",
    description: "Can carry medium packages and easily navigate traffic.",
    image: "/motor.png",
  },
  {
    value: "Bicycle",
    label: "Bicycle",
    description:
      "Use a secure compartment or bag to protect items during delivery.",
    image: "/bike.png",
  },
];

const TOTAL_STEPS = 5;

const DOCUMENTS = [
  {
    id: "license",
    title: "Driving License ID",
    sampleImage: "/sample/2.png",
    description:
      "Siguraduhing valid and lisensya na isusumite. Kailangan malinaw at nakikita ang bawat sulok ng ID.",
    criteria: [
      "Image and text must be clear",
      "Take the photo in a well-lit place",
      "Do not use flash",
    ],
  },
  {
    id: "cr",
    title: "Vehicle Cert of Reg (CR)",
    sampleImage: "/sample/3.png",
    description:
      "Kung hindi sayo nakapangalan ang sasakyan, magpasa rin ng LOA - patunay na pwede gamitin ang sasakyan.",
    criteria: [
      "Image and text must be clear",
      "Take the photo in a well-lit place",
      "Do not use flash",
    ],
  },
  {
    id: "or",
    title: "Official Receipt (OR)",
    sampleImage: "/sample/4.png",
    description:
      "Siguraduhing hindi malabo at hindi expired ang OR na ipapasa.",
    criteria: [
      "Image and text must be clear",
      "Take the photo in a well-lit place",
      "Do not use flash",
    ],
  },
  {
    id: "vehicle_back",
    title: "Vehicle Back",
    sampleImage: "/sample/5.png",
    description:
      "Kuhanan ng larawan ang sasakyan sa ganitong angulo. Dapat kita ang plate number at gilid na bahagi.",
    criteria: [
      "Image and text must be clear",
      "Take the photo in a well-lit place",
      "Do not use flash",
    ],
  },
  {
    id: "profile",
    title: "Profile Photo",
    sampleImage: "/sample/1.png",
    description:
      "Kailangang solo, naka TSHIRT o POLO at walang sombrero, salamin, o facemask na suot.",
    criteria: [
      "Image and text must be clear",
      "Take the photo in a well-lit place",
      "Do not use flash",
    ],
  },
];

const OnboardingForm = ({ rider }: { rider: Rider }) => {
  const router = useRouter();

  // === STATES ===
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    name: "",
    vehicleType: "",
    gender: "",
    dob: "",
    phone: "",
    licenseNo: "",
    plateNo: "",
    vehicleOwnership: "",
    documents: {},
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  // modal
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // === LOAD FROM LOCAL STORAGE ===
  useEffect(() => {
    const saved = localStorage.getItem("onboardingRiderData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev: any) => ({ ...prev, ...(parsed.formData || {}) }));
        setStep(parsed.step || 1);
        // restore checkbox if stored
        if (parsed.checkboxChecked) setCheckboxChecked(true);
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  // === SAVE TO LOCAL STORAGE ON CHANGE ===
  useEffect(() => {
    localStorage.setItem(
      "onboardingRiderData",
      JSON.stringify({ step, formData, checkboxChecked })
    );
  }, [step, formData, checkboxChecked]);

  // === HANDLE INPUTS ===
  const updateField = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  // === VALIDATION PER STEP ===
  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.name && !!formData.vehicleType;
      case 2:
        return (
          !!formData.gender &&
          !!formData.dob &&
          !!formData.phone &&
          !!formData.licenseNo
        );
      case 3:
        return !!formData.plateNo;
      case 4:
        return checkboxChecked;
      case 5:
        // require vehicleOwnership AND all required documents uploaded
        const docs = formData.documents || {};
        const allUploaded = DOCUMENTS.every(
          (d) => docs[d.id] && docs[d.id].url
        );
        return !!formData.vehicleOwnership && allUploaded;
      default:
        return false;
    }
  };

  // === HANDLE LOGOUT/CANCEL ===
  const handleCancel = async () => {
    await signOut();
    setToast({ message: "Logout successfully", type: "success" });
    router.push("/sign-up");
  };

  // === SUBMIT TO BACKEND ===
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await onboardRider(formData, rider.id);

      if (response.error) {
        setToast({ message: response.error, type: "error" });
        return;
      }

      // Clear temporary onboarding data
      localStorage.removeItem("onboardingRiderData");

      setToast({
        message: response.success || "Onboarded successfully.",
        type: "success",
      });
      router.push("/dashboard");
    } catch (err: any) {
      setToast({ message: err.message || "Submission error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // === NEXT HANDLER ===
  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await handleSubmit();
    }
  };

  // === BACK HANDLER ===
  const handleBack = () => {
    if (step > 1) setStep((p) => p - 1);
  };

  // === VIRTUAL TRAINING SCROLL DETECTOR ===
  const handleScroll = () => {
    const div = scrollRef.current;
    if (div && div.scrollTop + div.clientHeight >= div.scrollHeight - 10) {
      setCheckboxChecked(true);
    }
  };

  // === OPEN / CLOSE MODAL ===
  const openDocModal = (docId: string) => {
    setActiveDocId(docId);
    setUploading(false);
  };

  const closeModal = () => {
    setActiveDocId(null);
    setUploading(false);
  };

  // === HANDLE FILE SELECTED (either camera or file picker) ===
  const handleFileChosen = async (file?: File) => {
    if (!activeDocId) return;
    if (!file) return;
    try {
      setUploading(true);

      const folder = `rider/documents/${activeDocId}`;

      const result = await uploadFile(file, folder);

      // update formData documents
      setFormData((prev: any) => ({
        ...prev,
        documents: {
          ...(prev.documents || {}),
          [activeDocId]: {
            url: result.url,
            key: result.key,
            filename: file.name,
          },
        },
      }));

      setUploading(false);

      // you can close modal automatically or keep it open to show preview.
      // we'll close it after a short delay
      setTimeout(() => {
        closeModal();
        setToast({
          message: "Document uploaded successfully",
          type: "success",
        });
      }, 600);
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || "Upload failed", type: "error" });
      setUploading(false);
    }
  };

  // === TRIGGERS FOR HIDDEN INPUTS ===
  const triggerCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
      cameraInputRef.current.click();
    }
  };
  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // === RENDER STEPS ===
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="mb-1 text-xl font-bold tracking-tight">
              Create your account
            </h3>
            <div className="space-y-2 mt-5">
              <CustomizedInput
                label="Name (as shown on ID)"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div className="space-y-2 mt-5">
              <Label>Vehicle type</Label>
              <RadioGroupPrimitive.Root
                value={formData.vehicleType}
                onValueChange={(value) => updateField("vehicleType", value)}
                className="w-full grid grid-cols-1 gap-4"
              >
                {vehicleTypeOptions.map((option) => (
                  <RadioGroupPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "relative group ring-[1px] ring-border rounded py-2 px-3 text-start",
                      "data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                    )}
                  >
                    <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-primary stroke-white group-data-[state=unchecked]:hidden" />
                    <div className="relative size-18">
                      <Image
                        src={option.image}
                        alt={option.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-semibold tracking-tight">
                      {option.label}
                    </span>
                    <p className="text-xs">{option.description}</p>
                  </RadioGroupPrimitive.Item>
                ))}
              </RadioGroupPrimitive.Root>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h3 className="mb-1 text-xl font-bold tracking-tight">
              Tell us about yourself
            </h3>
            <div className="space-y-2 mt-5">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(val) => updateField("gender", val)}
                className="flex items-center gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" />
                  <Label>Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" />
                  <Label>Female</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2 mt-5">
              <DatePicker
                label="Date of Birth"
                placeholder="MM/DD/YYYY"
                value={formData.dob ? new Date(formData.dob) : undefined}
                onChangeAction={(date) =>
                  updateField("dob", date ? date.toISOString() : "")
                }
              />
            </div>
            <div className="space-y-2 mt-5">
              <CustomizedInput
                label="Phone Number"
                type="number"
                leftSlot="+63"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "");
                  if (cleaned.length <= 10) updateField("phone", cleaned);
                }}
              />
            </div>
            <div className="space-y-2 mt-5">
              <CustomizedInput
                label="Driver License Number"
                value={formData.licenseNo}
                onChange={(e) => updateField("licenseNo", e.target.value)}
              />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3 className="mb-1 text-xl font-bold tracking-tight">
              Add vehicle information
            </h3>
            <div className="space-y-2 mt-5">
              <CustomizedInput
                label="Vehicle Plate Number"
                value={formData.plateNo}
                onChange={(e) => updateField("plateNo", e.target.value)}
              />
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h3 className="mb-1 text-xl font-bold tracking-tight">
              Virtual Training
            </h3>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="mt-5 p-3 h-[55vh] border rounded overflow-y-auto space-y-3 text-sm scrollbar-hide"
            >
              <p>
                Maligayang pagdating sa aming pagsasanay para sa mga delivery
                partner! Sa bahaging ito, ipapaliwanag namin ang lahat ng
                kailangang malaman tungkol sa aming sistema, mga patakaran, at
                tamang paraan ng paghahatid. Layunin namin na matiyak ang
                maayos, ligtas, at maaasahang serbisyo para sa ating mga
                customer sa loob ng komunidad.
              </p>

              <p>
                <strong>1. Uri ng Sasakyan</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Motorcycle:</strong> Para sa mga may motorsiklo,
                  siguraduhing kumpleto ang mga dokumento tulad ng lisensya,
                  rehistro, at iba pang kaukulang papeles.
                </li>
                <li>
                  <strong>Bicycle:</strong> Walang kinakailangang lisensya o
                  rehistro, ngunit siguraduhing ang bisikleta ay may
                  compartment, delivery bag, o box na maaaring paglagyan ng mga
                  pagkain o hindi pagkain na produkto upang masiguro ang
                  kalinisan at kaligtasan ng mga ito.
                </li>
              </ul>

              <p>
                <strong>2. Lugar ng Operasyon</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  Ang lahat ng deliveries ay ginagawa lamang sa loob ng
                  komunidad ng <strong>Villamor Airbase</strong> at mga karatig
                  na lugar.
                </li>
                <li>
                  Dahil dito, hindi kailangang magdagdag ng bayad kada
                  kilometro. Ang presyo ay pareho anuman ang distansya sa loob
                  ng itinakdang ruta.
                </li>
              </ul>

              <p>
                <strong>3. Sistema ng Komisyon</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Motorcycle:</strong> ₱50.00 kada delivery.
                </li>
                <li>
                  <strong>Bicycle:</strong> ₱40.00 kada delivery.
                </li>
                <li>
                  Ang kita ay batay sa matagumpay na paghahatid at sa kabuuang
                  bilang ng deliveries bawat araw.
                </li>
                <li>
                  Maaaring magkaroon ng{" "}
                  <strong>
                    maramihang stop o tatlong order sa isang biyahe
                  </strong>{" "}
                  upang mas mapalaki ang iyong kita. Depende ito sa diskarte ng
                  driver kung paano niya pagsasabayin ang mga order nang maayos
                  at nasa oras.
                </li>
              </ul>

              <p>
                <strong>4. Oras ng Paghahatid</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  Siguraduhing maihatid ang order sa loob ng oras na ipinapakita
                  sa iyong app.
                </li>
                <li>
                  Ang pagiging maagap at maayos na pakikitungo sa customer ay
                  nakakatulong upang mapanatili ang mataas na rating at mas
                  maraming delivery opportunities.
                </li>
              </ul>

              <p>
                <strong>5. Mga Alituntunin at Regulasyon</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  Laging magsuot ng maayos at kumportableng kasuotan habang
                  nagtatrabaho. Para sa motorcycle riders, siguraduhing may
                  helmet at closed shoes.
                </li>
                <li>
                  Igalang ang lahat ng customer, kasama na ang mga guwardiya,
                  staff, at residente sa komunidad.
                </li>
                <li>
                  Siguraduhing malinis at maayos ang iyong gamit at lalagyan ng
                  mga produkto.
                </li>
                <li>
                  Iwasan ang pakikialam o pagbubukas ng anumang package o
                  pagkain habang nasa biyahe.
                </li>
              </ul>

              <p>
                <strong>6. Mga Dokumento para sa Motorcycle Riders</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>Valid driver’s license.</li>
                <li>Certificate of Registration (CR) ng motorsiklo.</li>
                <li>Official Receipt (OR) ng sasakyan.</li>
                <li>
                  Kung hindi nakapangalan sa iyo ang motorsiklo:
                  <ul className="list-disc pl-5">
                    <li>
                      Maghanda ng <strong>Letter of Authorization (LOA)</strong>{" "}
                      na may kalakip na valid ID ng may-ari ng motorsiklo. Dapat
                      tumugma ang pangalan ng may-ari sa CR.
                    </li>
                    <li>
                      Kung wala namang LOA, maaaring magsumite ng{" "}
                      <strong>Deed of Sale</strong> na tumutugma rin sa pangalan
                      ng may-ari sa CR.
                    </li>
                  </ul>
                </li>
              </ul>

              <p>
                <strong>7. Mga Paglabag at Parusa</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  Ang sinumang lalabag sa mga patakaran o magdudulot ng reklamo
                  mula sa customer ay maaaring masuspinde o ma-deactivate ang
                  account.
                </li>
                <li>
                  Kasama sa mga paglabag ang hindi maayos na paghahatid, bastos
                  na pakikitungo, o maling paggamit ng uniform at app.
                </li>
              </ul>

              <p>
                <strong>8. Pagtatapos ng Bahagi</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  Kapag naabot mo na ang dulo ng seksyong ito, ang checkbox ay
                  awtomatikong maki-check bilang patunay na nabasa mo at
                  naunawaan ang mga alituntunin.
                </li>
                <li>
                  Maaari mo ring bisitahin ang link ng ating{" "}
                  <strong>1 Market Philippines Community Guidelines</strong>{" "}
                  para sa iba pang detalye at patakaran.
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <Checkbox checked={checkboxChecked} />
              <Label>
                I have read and understood the virtual training content.
              </Label>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <h3 className="mb-1 text-xl font-bold tracking-tight">
              Last step: Verification
            </h3>
            <div className="space-y-2 mt-5">
              <CustomizedSelect
                label="Vehicle Ownership"
                value={formData.vehicleOwnership}
                onChange={(val) => updateField("vehicleOwnership", val)}
                options={[
                  { label: "Registered Owner", value: "Registered Owner" },
                  {
                    label: "Non-Registered/Second-Hand Owner",
                    value: "Non-Registered/Second-Hand Owner",
                  },
                  { label: "Rental/Borrow", value: "Rental/Borrow" },
                ]}
              />
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">
                Supporting Documents
              </p>
              <div className="grid gap-3">
                {DOCUMENTS.map((doc) => {
                  const uploaded = formData.documents?.[doc.id];
                  return (
                    <div
                      onClick={() => openDocModal(doc.id)}
                      key={doc.id}
                      className="border cursor-pointer border-primary rounded-sm flex items-center gap-3 p-2 bg-primary/20"
                    >
                      <div className="bg-primary/30 flex items-center rounded-sm justify-center size-10">
                        {uploaded?.url ? (
                          <img
                            src={uploaded.url}
                            alt={doc.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="bg-white size-7 rounded-full flex items-center justify-center">
                            <Upload className="text-primary size-4" />
                          </div>
                        )}
                      </div>
                      <p className="text-primary font-semibold text-sm tracking-tight">
                        {doc.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // === HANDLERS FOR HIDDEN INPUTS' onChange ===
  const onCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChosen(file);
  };
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChosen(file);
  };

  // get active doc object
  const activeDoc = DOCUMENTS.find((d) => d.id === activeDocId) || null;

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleCancel}
        title="Logout confirmation"
        description="Are you sure you want to logout? This action cannot be undone."
      />
      <div className="flex border-b px-3 py-2 w-full items-center">
        <Link href="/sign-up">
          <ArrowLeft className="size-6" />
        </Link>
        <span className="text-center mx-auto font-semibold">Onboarding</span>
        <Button
          variant="ghost"
          className="!p-0"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <LogOut className="size-6 text-primary" />
        </Button>
      </div>
      <div className="relative h-full flex flex-col">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onCameraInputChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileInputChange}
        />
        <div className="flex-1 overflow-y-auto px-3 pt-3 scrollbar-hide">
          <span className="tracking-tight text-sm font-medium text-muted-foreground">
            Step {step} of {TOTAL_STEPS}
          </span>
          <div className="space-y-6 mt-1 mb-2">{renderStepContent()}</div>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              duration={3000}
              onClose={() => setToast(null)}
            />
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1 || loading}
            >
              Back
            </Button>
          )}
          <div className="flex-1">
            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={!isStepValid() || loading}
              onClick={handleNext}
            >
              {loading
                ? "Please wait..."
                : step < TOTAL_STEPS
                  ? "Next"
                  : "Submit"}
            </Button>
          </div>
        </div>

        <Modal
          isOpen={!!activeDoc}
          onClose={() => setActiveDocId(null)}
          title={activeDoc?.title}
          className="!max-w-full"
        >
          {activeDoc && (
            <div>
              <p className="text-center font-medium text-sm text-zinc-500 mb-5">
                {activeDoc.description}
              </p>
              <div className="w-full h-48 bg-slate-100 rounded mb-4 flex items-center justify-center">
                {/* if you have guidelineImage, render it */}
                <img
                  src={activeDoc.sampleImage}
                  alt="Guideline"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="mt-5 space-y-1">
                {activeDoc.criteria.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-green-600" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-16 grid gap-3">
                <Button
                  type="button"
                  onClick={triggerCamera}
                  disabled={uploading}
                >
                  <Camera className="size-4" /> Take Photo
                </Button>
                <Button
                  type="button"
                  onClick={triggerFilePicker}
                  disabled={uploading}
                  variant="outline"
                >
                  <FolderUp className="size-4" /> Upload File
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default OnboardingForm;
