import type { Profile } from '../types'
import './ProfileIcon.scss'

interface ProfileIconProps {
  profile: Profile
  size?: number
}

const ProfileIcon = (props: ProfileIconProps) => {
  
  const size = props.size || 20

  return <span className="profile-icon" style={{backgroundColor: props.profile.color, width: size, height: size, fontSize: size-4, borderRadius: 4}}>{props.profile.name}</span>
}

export default ProfileIcon
