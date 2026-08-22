export const generateArticleDescription = article => {
  const cleanArticle = article
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanArticle) {
    return '';
  }

  const sentences = cleanArticle
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => sentence.length > 20);

  if (sentences.length <= 2) {
    return sentences.join(' ');
  }

  const stopWords = new Set([
    'і',
    'й',
    'та',
    'а',
    'але',
    'або',
    'що',
    'це',
    'як',
    'у',
    'в',
    'на',
    'до',
    'з',
    'із',
    'за',
    'для',
    'про',
    'по',
    'від',
    'не',
    'так',
    'також',
    'можна',
    'який',
    'яка',
    'яке',
    'які',
  ]);

  const words = cleanArticle
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  const frequencies = {};

  for (const word of words) {
    frequencies[word] = (frequencies[word] || 0) + 1;
  }

  const scoredSentences = sentences.map(sentence => {
    const sentenceWords = sentence
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/);

    const score = sentenceWords.reduce(
      (total, word) => total + (frequencies[word] || 0),
      0,
    );

    return {
      sentence,
      score,
    };
  });

  const selectedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .sort(
      (a, b) =>
        sentences.indexOf(a.sentence) -
        sentences.indexOf(b.sentence),
    );

  return selectedSentences
    .map(item => item.sentence)
    .join(' ');
};
