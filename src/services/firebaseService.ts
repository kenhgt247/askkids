import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove, 
    onSnapshot, 
    query, 
    orderBy, 
    increment,
    setDoc,
    where,
    getDoc
} from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import { db, auth, googleProvider } from "../firebaseConfig";
import { User, Question, BlogPost, Answer, Comment, UserRole } from "../types";
import { initialQuestions, initialBlogPosts } from "./mockData";

// --- AUTHENTICATION ---
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if user exists in Firestore, if not create one
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const newUser: User = {
                id: user.uid,
                name: user.displayName || "Thành viên mới",
                email: user.email || "",
                role: UserRole.USER,
                points: 10, // Welcome points
                avatar: user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
                bio: "Thành viên mới gia nhập Asking.vn"
            };
            await setDoc(userRef, newUser);
            return newUser;
        } else {
            return userSnap.data() as User;
        }
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};

export const logoutUser = async () => {
    await signOut(auth);
};

// --- REAL-TIME LISTENERS ---

// Lắng nghe danh sách câu hỏi
export const subscribeToQuestions = (callback: (data: Question[]) => void) => {
    const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
        callback(questions);
    });
};

// Lắng nghe danh sách Blog
export const subscribeToBlogs = (callback: (data: BlogPost[]) => void) => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        callback(blogs);
    });
};

// --- CRUD OPERATIONS ---

// Thêm câu hỏi mới
export const addQuestionToFirestore = async (questionData: any, user: User) => {
    const newQuestion = {
        ...questionData,
        userId: user.id,
        author: user,
        votes: 0,
        views: 0,
        answersCount: 0,
        answers: [],
        createdAt: new Date().toISOString(), // Use ISO string for simplicity in demo
        isLiked: false // This ideally should be a subcollection 'likes' for scalability
    };
    await addDoc(collection(db, "questions"), newQuestion);
};

// Thêm Blog (cần duyệt)
export const addBlogToFirestore = async (blogData: any, user: User) => {
    const newBlog = {
        ...blogData,
        userId: user.id,
        author: user,
        views: 0,
        likes: 0,
        status: 'pending',
        comments: [],
        createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, "blogs"), newBlog);
};

// Like câu hỏi (Client-side toggle simulation saved to DB)
export const toggleLikeQuestion = async (questionId: string, currentVotes: number, isLiked: boolean) => {
    const qRef = doc(db, "questions", questionId);
    await updateDoc(qRef, {
        votes: isLiked ? currentVotes - 1 : currentVotes + 1,
        // Lưu ý: Trong thực tế, cần lưu userId vào collection 'likes' để biết ai đã like.
        // Ở đây ta update trực tiếp field isLiked (chỉ work cho 1 user, demo logic)
    });
};

// Thêm câu trả lời
export const addAnswerToFirestore = async (questionId: string, content: string, user: User) => {
    const qRef = doc(db, "questions", questionId);
    const newAnswer: Answer = {
        id: `a${Date.now()}`,
        userId: user.id,
        author: user,
        content,
        votes: 0,
        isAccepted: false,
        createdAt: new Date().toISOString(),
        comments: []
    };
    await updateDoc(qRef, {
        answers: arrayUnion(newAnswer),
        answersCount: increment(1)
    });
};

// --- SEED DATA FUNCTION (Dùng để nạp dữ liệu mẫu ban đầu) ---
export const seedDatabase = async () => {
    const qCol = collection(db, "questions");
    const bCol = collection(db, "blogs");
    
    // Check if data exists
    const snap = await getDocs(qCol);
    if (!snap.empty) {
        alert("Dữ liệu đã tồn tại, không cần seed lại!");
        return;
    }

    // Seed Questions
    for (const q of initialQuestions) {
        // Remove ID to let Firestore generate it, or use setDoc with ID
        const { id, ...data } = q;
        await addDoc(qCol, data);
    }

    // Seed Blogs
    for (const b of initialBlogPosts) {
        const { id, ...data } = b;
        await addDoc(bCol, data);
    }

    alert("Đã khởi tạo dữ liệu mẫu thành công!");
};
