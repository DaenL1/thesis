"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  AlertCircle,
  Save,
  Loader2,
  CheckCircle,
  Lock,
  X,
  Upload,
  Camera
} from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { GetCurrentMemberProfileData, MemberProfileData, UpdateMemberProfile, SaveProfilePicture, RemoveProfilePicture } from "../actions"
import Image from "next/image"

export default function MemberProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<MemberProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = useState({
    email: ""
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch member profile data
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        const data = await GetCurrentMemberProfileData();
        if (data) {
          setProfileData(data);
          setFormData({
            email: data.email
          });
          // Set profile image if it exists
          if (data.profilePicture) {
            setProfileImage(data.profilePicture);
          }
        } else {
          setError("Could not retrieve profile data. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData) return;
    
    try {
      setIsSaving(true);
      
      const success = await UpdateMemberProfile(profileData.memberId, {
        email: formData.email
      });
      
      if (success) {
        // Update the profile data with the new values
        setProfileData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            email: formData.email
          };
        });
        
        toast({
          title: "Profile Updated",
          description: "Your email has been updated successfully.",
        });
        
        setIsEditing(false);
      } else {
        toast({
          title: "Update Failed",
          description: "There was an error updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Simulate password change (would connect to an API in a real implementation)
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    // Reset form and close modal
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswordModal(false);
  };

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileData) return;

    // Check file type
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Profile picture must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      setProfileImage(imageData);
      
      // Save to database
      const success = await SaveProfilePicture(profileData.memberId, imageData);
      
      if (success) {
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        });
      } else {
        toast({
          title: "Update failed",
          description: "There was an error updating your profile picture. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Remove profile picture
  const handleRemoveProfilePicture = async () => {
    if (!profileData) return;
    
    try {
      const success = await RemoveProfilePicture(profileData.memberId);
      
      if (success) {
        setProfileImage(null);
        toast({
          title: "Profile picture removed",
          description: "Your profile picture has been removed.",
        });
      } else {
        toast({
          title: "Removal failed",
          description: "There was an error removing your profile picture. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your profile picture. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error || "Unable to load profile information. Please try again later."}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType="member" userName={profileData.name} />

      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/members'}
              >
                <span>Back to Dashboard</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-1"
            >
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {profileImage ? (
                        <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                          <img 
                            src={profileImage} 
                            alt={profileData.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <Image 
                          src="/pandol-logo.png" 
                          alt="Pandol Cooperative Logo" 
                          width={100} 
                          height={100} 
                          className="mb-4 rounded-full"
                        />
                      )}
                      <button 
                        onClick={triggerFileInput}
                        className="absolute bottom-3 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                        title="Upload profile picture"
                      >
                        <Camera className="h-5 w-5 text-amber-600" />
                      </button>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <h2 className="text-xl font-bold text-center">{profileData.name}</h2>
                    <p className="text-gray-500 text-center">{profileData.memberID}</p>
                    <p className="text-sm text-gray-500 text-center mt-1">Member since {profileData.joinDate}</p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profileData.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{profileData.address || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Image Options */}
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow mt-6">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      onClick={triggerFileInput}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload New Picture
                        </>
                      )}
                    </Button>
                    
                    {profileImage && (
                      <Button 
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleRemoveProfilePicture}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove Picture
                      </Button>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Supported formats: JPEG, PNG</p>
                      <p>Maximum size: 5MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Member Stats Card */}
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow mt-6">
                <CardHeader>
                  <CardTitle>Member Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-500">Credit Balance</p>
                      </div>
                      <p className="font-bold text-green-600">₱{profileData.creditBalance.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="text-sm text-gray-500">Credit Limit</p>
                      </div>
                      <p className="font-bold">₱{profileData.creditLimit.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500">Total Purchases</p>
                      </div>
                      <p className="font-bold">{profileData.totalPurchases}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm text-gray-500">Total Spent</p>
                      </div>
                      <p className="font-bold">₱{profileData.totalTransactions.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Edit Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="md:col-span-2"
            >
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? "Update your email address below" 
                      : "View your personal information"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              name="name"
                              placeholder="Your full name"
                              className="pl-10"
                              value={profileData.name}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Your email address"
                              className="pl-10"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="Your phone number"
                              className="pl-10"
                              value={profileData.phone || ""}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="memberID">Member ID</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="memberID"
                              value={profileData.memberID}
                              className="pl-10"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Textarea
                              id="address"
                              name="address"
                              placeholder="Your address"
                              className="pl-10 min-h-[100px]"
                              value={profileData.address || ""}
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            You can only update your email address. For other changes, please contact the cooperative office.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      {isEditing ? (
                        <>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              // Reset form data to original values
                              setFormData({
                                email: profileData.email
                              });
                            }}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button 
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        >
                          Edit Email
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow mt-6">
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-500">Last changed: Never</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => setShowPasswordModal(true)}
                      >
                        Change Password
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" disabled>Coming Soon</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Login History</h3>
                        <p className="text-sm text-gray-500">View your recent login activity</p>
                      </div>
                      <Button variant="outline" disabled>Coming Soon</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Change Password</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowPasswordModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                      className="pl-10"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      className="pl-10"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      className="pl-10"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 