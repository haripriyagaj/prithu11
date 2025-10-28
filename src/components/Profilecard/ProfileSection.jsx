// src/components/PostSection.jsx
import React, { useState, useEffect } from "react";
import {useAuth} from "../../../context/AuthContext"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axios";
import toast from "react-hot-toast";

export default function PostSection() {
  const [activeOption, setActiveOption] = useState("view");
  const { user, updateUserProfile, fetchUserProfile, loading } = useAuth();

  const options = [
    { id: "view", label: "View" },
    { id: "edit", label: "Edit" },
    { id: "profile-photo", label: "Change Profile Photo" },
    { id: "cover-image", label: "Change Cover Image" },
    { id: "settings", label: "Settings" },
  ];

  const renderContent = () => {
    switch (activeOption) {
      case "view":
        return <ViewProfile user={user} />;
      case "edit":
        return (
          <EditProfile
            user={user}
            updateUserProfile={updateUserProfile}
            fetchUserProfile={fetchUserProfile}
            loading={loading}
          />
        );
      case "profile-photo":
        return <ChangeProfilePhoto user={user} fetchUserProfile={fetchUserProfile} />;
      case "cover-image":
        return <ChangeCoverImage user={user} fetchUserProfile={fetchUserProfile} />;
      case "settings":
        return <ProfileSettings user={user} fetchUserProfile={fetchUserProfile} />;
      default:
        return <ViewProfile user={user} />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* ────── 5 Navigation Tabs ────── */}
      <div className="flex gap-6 mb-8 border-b border-gray-200">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActiveOption(opt.id)}
            className={`
              pb-3 text-sm font-medium border-b-2 transition-all duration-200
              ${activeOption === opt.id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ────── Dynamic Content Area ────── */}
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}

/* ────── 1. View Profile ────── */
function ViewProfile({ user }) {
  const fields = [
    { label: "Name", value: user?.displayName || "-" },
    { label: "Date of Birth", value: user?.dob ? new Date(user.dob).toLocaleDateString() : "-" },
    { label: "Sex", value: user?.sex || "-" },
    { label: "City", value: user?.city || "-" },
    { label: "Country", value: user?.country || "-" },
    { label: "Bio", value: user?.bio || "-" },
    { label: "Phone", value: user?.phone || "-" },
    { label: "Marital Status", value: user?.maritalStatus || "-" },
    { label: "Language", value: user?.language || "-" },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">View Profile</h3>
      <p className="text-sm text-gray-600 mb-6">Base</p>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((f) => (
          <div key={f.label} className="flex">
            <dt className="w-32 text-sm font-medium text-gray-500">{f.label}</dt>
            <dd className="flex-1 text-sm text-gray-900">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ────── 2. Edit Profile ────── */
function EditProfile({ user, updateUserProfile, fetchUserProfile, loading }) {
  const [name, setName] = useState(user?.displayName || "");
  const [dob, setDob] = useState(user?.dob ? new Date(user.dob) : null);
  const [sex, setSex] = useState(user?.sex || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [maritalStatus, setMaritalStatus] = useState(user?.maritalStatus || "Single");
  const [language, setLanguage] = useState(user?.language || "English");

  // keep local state in sync if user changes (e.g. after a successful upload)
  useEffect(() => {
    setName(user?.displayName || "");
    setDob(user?.dob ? new Date(user.dob) : null);
    setSex(user?.sex || "");
    setCity(user?.city || "");
    setCountry(user?.country || "");
    setBio(user?.bio || "");
    setPhone(user?.phone || "");
    setMaritalStatus(user?.maritalStatus || "Single");
    setLanguage(user?.language || "English");
  }, [user]);

  const handleSave = async () => {
    const payload = {
      displayName: name,
      dob,
      sex,
      city,
      country,
      bio,
      phone,
      maritalStatus,
      language,
    };

    try {
      await updateUserProfile(payload);
      await fetchUserProfile(); // refresh context
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>

      <form className="space-y-6 max-w-2xl" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <DatePicker
            selected={dob}
            onChange={(date) => setDob(date)}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            showYearDropdown
            scrollableYearDropdown
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          >
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
          <select
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          >
            <option>Single</option>
            <option>Married</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          >
            <option>English</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Hindi</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2.5 font-medium rounded-lg transition ${
              loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ────── 3. Change Profile Photo ────── */
function ChangeProfilePhoto({ user, fetchUserProfile }) {
  const [preview, setPreview] = useState(user?.profileAvatar || "");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("profileAvatar", file);

    try {
      await axios.post("/api/user/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile photo updated!");
      await fetchUserProfile(); // refresh context
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  // preview
  const onFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      handleFileChange(e);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Change Profile Photo</h3>

      <div className="flex items-center gap-10">
        {/* Preview */}
        <div className="w-36 h-36 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-400 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl text-gray-400">+</span>
          )}
        </div>

        <div className="max-w-md">
          <p className="text-sm text-gray-600 mb-4">
            Upload a new profile picture. Recommended size: <strong>400x400px</strong>
          </p>
          <label className="inline-block">
            <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
            <span className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg cursor-pointer hover:bg-purple-700 transition">
              Choose File
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* ────── 4. Change Cover Image ────── */
function ChangeCoverImage({ user, fetchUserProfile }) {
  const [preview, setPreview] = useState(user?.coverImage || "");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("coverImage", file);

    try {
      await axios.post("/api/user/profile/cover", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cover image updated!");
      await fetchUserProfile();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const onFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      handleFileChange(e);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Change Cover Image</h3>

      <div className="space-y-6">
        {/* Preview Area */}
        <div className="h-56 bg-gray-100 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} alt="cover preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl text-gray-400">+</span>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Upload a new cover image. Recommended size: <strong>1200x400px</strong>
        </p>

        <label className="inline-block">
          <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
          <span className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg cursor-pointer hover:bg-purple-700 transition">
            Upload Cover
          </span>
        </label>
      </div>
    </div>
  );
}

/* ────── 5. Settings ────── */
function ProfileSettings({ user, fetchUserProfile }) {
  const [showProfile, setShowProfile] = useState(user?.privacy?.showProfile ?? true);
  const [emailOnFollow, setEmailOnFollow] = useState(user?.notifications?.emailOnFollow ?? true);

  const saveSettings = async () => {
    try {
      await axios.post("/api/user/profile/settings", {
        privacy: { showProfile },
        notifications: { emailOnFollow },
      });
      toast.success("Settings saved!");
      await fetchUserProfile();
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  const deleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await axios.delete("/api/user/profile");
      toast.success("Profile deleted");
      // optional: logout / redirect
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>

      <div className="space-y-8 max-w-2xl">
        {/* Privacy */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Privacy</h4>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showProfile}
              onChange={(e) => setShowProfile(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">Show profile to everyone</span>
          </label>
        </div>

        {/* Notifications */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Notifications</h4>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={emailOnFollow}
              onChange={(e) => setEmailOnFollow(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">Email me when someone follows me</span>
          </label>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={saveSettings}
            className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
          >
            Save Settings
          </button>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={deleteProfile}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition"
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}