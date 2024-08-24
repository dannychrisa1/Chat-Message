import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { upload } from "../lib/upload"; // Ensure this path is correct
import { AppContext } from "../context/AppContext";
import { userData } from "../context/AppContext";

export const ProfileUpdate = () => {
    const bgstyles: React.CSSProperties = {
        backgroundImage: "url(background.png)"
    };

    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [prevImage, setPrevImage] = useState<string>("");
    const [uid, setUid] = useState<string>("");
    const { setUserData } = useContext(AppContext)
    const navigate = useNavigate();

    const profileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!prevImage && !image) {
                toast.error("Upload profile picture");
                return; // Exit early if no image is provided
            }
            const docRef = doc(db, "users", uid);
            if (image) {
                const imgUrl = await upload(image); // Wait for the upload to complete
                setPrevImage(imgUrl); // Update the state only if the upload was successful
                await updateDoc(docRef, {
                    avatar: imgUrl,
                    bio: bio,
                    name: name
                });
                toast.success('user profile updated successfully')
            } else {
                await updateDoc(docRef, {
                    bio: bio,
                    name: name
                });
            }
            const snap = await getDoc(docRef);
            // Check if snap.data() is undefined before setting state
            if (snap.exists()) {
                // Using type assertion here, assuming snap.data() returns DocumentData
                setUserData(snap.data() as userData[])
            } else {
                // Handle the case where the document does not exist
                setUserData([]); // Set an empty object or handle accordingly
            }
            navigate('/chat')
        } catch (error) {
            console.error(error as Error);
            toast.error((error as Error).message);
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                let docInfo = docSnap.data();
                if (docInfo?.name) {
                    setName(docInfo.name);
                };
                if (docInfo?.bio) {
                    setBio(docInfo.bio);
                };
                if (docInfo?.avatar) {
                    setPrevImage(docInfo.avatar);
                };
            } else {
                navigate('/');
            }
        });
        // eslint-disable-next-line
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setImage(file);
        } else {
            return;
        }
    };

    return (
        <div style={bgstyles} className="Profile min-h-[100vh] bg-no-repeat bg-cover flex items-center justify-center">
            <div className="profile-container bg-white flex items-center justify-between min-w-[700px] rounded-[10px]">
                <form onSubmit={profileUpdate} className="flex flex-col gap-[20px] p-[40px]">
                    <h3 className="font-[500]">Profile Details</h3>
                    <label htmlFor="avatar" className="flex items-center gap-[10px] text-[gray] cursor-pointer">
                        <input
                            onChange={handleFileChange}
                            type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
                        <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} className="w-[50px] aspect-square rounded-[50%]" alt="avatar" />
                        Upload profile image
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text" placeholder="Your name" className="p-[10px] min-w-[300px] border-solid border-[#c9c9c9] border outline-[#077eff]" required />
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        placeholder="Write profile bio" className="p-[10px] min-w-[300px] border-solid border-[#c9c9c9] border outline-[#077eff]" required />
                    <button type="submit">Save</button>
                </form>
                <img 
                src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} 
                className="max-w-[160px] aspect-square my-[20px] mx-auto rounded-[50%]" alt="logo_icon" />
            </div>
        </div>
    );
}