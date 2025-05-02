import { useTranslation } from '@pancakeswap/localization'
import { useModal } from '@pancakeswap/uikit'
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import { IdType, useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import { useEffect } from 'react'
import Hero from './components/Hero'
import IfoProvider from './contexts/IfoContext'

export const IfoPageLayout = ({ children }) => {
  const { t } = useTranslation()

  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement(IdType.IFO)
  const [onUSCitizenModalPresent] = useModal(
    <USCitizenConfirmModal
      title={t('9mm Swap IFOs')}
      id={IdType.IFO}
      checks={[
        {
          key: 'checkbox',
          content: t('I confirm that I am eligible to participate in IFOs on this platform.'),
        },
      ]}
    />,
    false,
    false,
    'usCitizenConfirmModal',
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userNotUsCitizenAcknowledgement) {
        onUSCitizenModalPresent()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [userNotUsCitizenAcknowledgement, onUSCitizenModalPresent])

  return (
    <IfoProvider>
      <Hero />
      {children}
    </IfoProvider>
  )
}
