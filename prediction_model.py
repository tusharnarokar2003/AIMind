import spacy
from transformers import pipeline





nlp = spacy.load("en_core_web_sm")


classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True,
    truncation=True
)


def analyze_mood(text):

    doc = nlp(text)
    sentences = [sent.text for sent in doc.sents]

    emotion_totals = {}

    for sentence in sentences:
        results = classifier(sentence)[0]
        for res in results:
            if res['label'] not in emotion_totals:
                emotion_totals[res['label']] = 0
            emotion_totals[res['label']] += res['score']

    ratings = {e: round((score / len(sentences)) * 5) for e, score in emotion_totals.items()}


    dominant_mood = max(ratings, key=ratings.get)

    return ratings, dominant_mood   


if __name__ == "__main__":
    text = input("Enter journal text: ")
    ratings, mood = analyze_mood(text)
    print("\nFinal Mood Ratings (per journal):")
    print(ratings)
    print("Main emotion is:", mood)
