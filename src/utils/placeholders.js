/**
 * Writing prompts and tips for placeholder text
 * Light, fun, and motivating suggestions in Dutch
 */

export const titlePlaceholders = [
  'Wat zou een vriend willen weten...',
  'De kern in één adem...',
  'Begin waar het begint...',
  'Laat de verrassing doorschemeren...',
  'Maak het tastbaar...',
  'Wat blijft hangen...',
  'Schrijf zoals je spreekt...',
  'Welk woord trekt de aandacht...',
  'Denk in beelden...',
  'Korter kan altijd...',
  'Waar klopt het hart van dit verhaal...',
  'Wie speelt de hoofdrol...',
  'Wat gebeurt er werkelijk...',
  'Maak het menselijk...',
  'Zoek de beweging...',
  'Wat raakt...',
  'Begin met wat nieuw is...',
  'Laat zien wat je bedoelt...',
  'Denk groot, schrijf helder...',
  'Waar ligt de spanning...',
  'Welk detail maakt het bijzonder...',
  'Kies kracht boven voorzichtigheid...',
  'Wat zou jij willen lezen...',
  'Vind de energie...',
  'Laat het sprankelen...'
]

export const introductionPlaceholders = [
  'Waarom is dit verhaal de moeite waard...',
  'Begin bij wat beweegt...',
  'Vat de essentie samen...',
  'Laat zien wat komen gaat...',
  'Maak nieuwsgierig naar meer...',
  'Zoom langzaam in...',
  'Vertel wat er werkelijk speelt...',
  'Geef context, maak ruimte...',
  'Waar raakt dit verhaal aan...',
  'Laat de lezer meekijken...',
  'Begin bij het begin...',
  'Wat moet je lezer begrijpen...',
  'Zoek de menselijke maat...',
  'Teken het grotere plaatje...',
  'Wek verwachting...',
  'Maak het voelbaar...',
  'Wat maakt dit nu belangrijk...',
  'Laat details spreken...',
  'Vertel wat anders is...',
  'Geef het verhaal adem...',
  'Waar ligt de kern...',
  'Maak het herkenbaar...',
  'Laat zien waarom het ertoe doet...',
  'Begin met wat leeft...',
  'Open de deur naar je verhaal...'
]

export const contentPlaceholders = [
  'Elke alinea vertelt zijn eigen verhaal...',
  'Laat het ademen...',
  'Wissel ritme en tempo...',
  'Maak het voelbaar...',
  'Toon, vertel niet alleen...',
  'Denk in beelden...',
  'Geef je woorden beweging...',
  'Laat details spreken...',
  'Schrijf zoals je spreekt...',
  'Zoek de menselijke maat...',
  'Maak abstract concreet...',
  'Geef ruimte tussen gedachten...',
  'Laat stemmen horen...',
  'Vertel waarom het ertoe doet...',
  'Zoek verbinding...',
  'Laat spanning en ontspanning wisselen...',
  'Vertel ook wat er níet is...',
  'Durf dilemma\'s te benoemen...',
  'Maak cijfers betekenisvol...',
  'Geef structuur, bewaar de flow...',
  'Wissel feiten met beleving...',
  'Leid de lezer door je verhaal...',
  'Stel vragen die je beantwoordt...',
  'Schrijf vanuit nieuwsgierigheid...',
  'Luister naar je eigen woorden...'
]

/**
 * Get a random placeholder from the specified category
 * @param {string} category - 'title', 'introduction', or 'content'
 * @returns {string} Random placeholder text
 */
export function getRandomPlaceholder(category) {
  let placeholders

  switch (category) {
    case 'title':
      placeholders = titlePlaceholders
      break
    case 'introduction':
      placeholders = introductionPlaceholders
      break
    case 'content':
      placeholders = contentPlaceholders
      break
    default:
      return ''
  }

  return placeholders[Math.floor(Math.random() * placeholders.length)]
}
