import React from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase-config"

const firebaseEx = ({ posts }) => {
    console.log("posts", posts)
    return <div>firebaseEx</div>
}

export default firebaseEx

export async function getStaticProps(context) {
    const posts = []
    const postsCollection = collection(db, "posts")
    const getPosts = await getDocs(postsCollection)
    getPosts.forEach((doc) => {
        posts.push({ id: doc.id, data: doc.data() })
    })
    return {
        props: {
            posts: posts,
        },
    }
}
