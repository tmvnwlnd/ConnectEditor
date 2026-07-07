import { useState, useEffect, useRef } from 'react'
import { Icon } from './ds'
import SettingsSection from './SettingsSection'
import SkillSelect from './publishing/SkillSelect'
import ChannelTargeting from './publishing/ChannelTargeting'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import '../styles/ArticleSettings.css'

// Tooltip icon component
const InfoTooltip = ({ text }) => {
  const iconRef = useRef(null)

  useEffect(() => {
    if (text && iconRef.current) {
      const instance = tippy(iconRef.current, {
        content: text,
        placement: 'top',
        theme: 'translucent',
        arrow: true,
        animation: 'fade',
        maxWidth: 280,
      })
      return () => instance.destroy()
    }
  }, [text])

  return (
    <span ref={iconRef} className="settings-info-icon">
      <Icon name="ui-info" size={16} color="var(--kpn-blue-500)" />
    </span>
  )
}

/**
 * ArticleTargeting — step 3: audience targeting.
 * Targets through channels (with doelgroepen inside) and skills/interesses.
 */
const ArticleTargeting = () => {
  const saved = JSON.parse(localStorage.getItem('articleTargetingData') || '{}')

  const [skills, setSkills] = useState(saved.skills || [])
  const [channels, setChannels] = useState(saved.channels || {})

  // Persist targeting data
  useEffect(() => {
    localStorage.setItem('articleTargetingData', JSON.stringify({ skills, channels }))
  }, [skills, channels])

  return (
    <div className="article-settings">
      <div className="article-settings-container">
        <div className="settings-single">
          <p className="body-r text-gray-400">
            Bepaal via welke channels (en de doelgroepen daarbinnen) en op welke skills
            dit artikel getarget wordt. Alle targeting is optioneel.
          </p>

          {/* 1. Channels (met doelgroepen daarbinnen) */}
          <SettingsSection
            label="Plaatsing in Channels"
            tag="(optioneel)"
            tooltip={<InfoTooltip text="Zet de channels aan waar het artikel geplaatst wordt. Per channel bepaal je de prioriteit per doelgroep; een globale instelling overschrijft de losse doelgroepen." />}
          >
            <ChannelTargeting value={channels} onChange={setChannels} />
          </SettingsSection>

          {/* 2. Skills & interesses (los van channels) */}
          <SettingsSection
            label="Skills & interesses"
            tag="(optioneel)"
            tooltip={<InfoTooltip text="Koppel het artikel aan relevante skills of interesses. Dit staat los van de channels. Tik voorgestelde labels aan om ze toe te voegen." />}
          >
            <SkillSelect selected={skills} onChange={setSkills} />
          </SettingsSection>
        </div>
      </div>
    </div>
  )
}

export default ArticleTargeting
