export function generateCodeMobile({
                                       overall,
                                       overallDorm,
                                       overallTeaching,
                                       dreamDorm,
                                       realDorm,
                                       dreamTeaching,
                                       realTeaching,
                                       emotionGroup
                                   }) {

    const motivation = {
        'Прогрессивный': "A", 'Регрессивный': "B", 'Импульсивный': "C", 'Экспрессивный': "D",
        'Мотивационо всеядный': "F", 'Мотивационо равнодушный': "G", 1: 'H', 2: 'I', 3: 'J',
        4: 'K'
    };

    return motivation[overall] + motivation[overallDorm] + motivation[overallTeaching] +
        motivation[dreamDorm] + motivation[realDorm] + motivation[dreamTeaching] +
        motivation[realTeaching] + motivation[emotionGroup];
}
