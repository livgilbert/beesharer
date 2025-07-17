import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import Home from './pages/Home'
import Game from './pages/Game'
import { BrowserRouter, Route, Routes } from 'react-router'
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import firebaseConfig from './firebaseConfig'
import { initializeApp } from 'firebase/app'
import { ref, get, set, child } from 'firebase/database'
import * as emoji from 'node-emoji'
import randomColor from 'randomcolor'
import ProfileContext from './ProfileContext'
import type { Profile } from './types'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

import db from './db'

const buildProfile = (uid: string):Profile => {
  const name = emoji.random().emoji
  const color = randomColor()
  return {name, color, uid}
}

const Main = () => {
  const [profile, setProfile] = useState<Profile | null>()

  useEffect(() => {
    return onAuthStateChanged(auth, (user:any) => {
      if (user != null) {
        const uid = user.uid
        get(child(ref(db), `users/${uid}`)).then(snapshot => {
          if (snapshot.exists()) {
            const val = snapshot.val()
            setProfile({ name: val.name, color: val.color, uid })
          } else {
            const newProfile = buildProfile(uid)
            set(ref(db, `users/${uid}`), {
              name: newProfile.name ,
              color: newProfile.color
            })
            setProfile(newProfile)
          }
        })
      }
    })
  }, [])


  useEffect(() => {
    signInAnonymously(auth).catch(error => console.error(error))
  }, [])

  if (profile) {
    return (
      <ProfileContext value={profile}>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:gameId" element={<Game />} />
      </Routes>
      </BrowserRouter>
      </ProfileContext>
    )
  } else {
    return <p>Filling honeycomb...</p>
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Main />
  </StrictMode>
)
