export function decodeMobileCode (data){
    try {
        let [code,fullname,gender,faculty,groupFaculty,subGroupFaculty] = data.split('_');

        const motivation = {'A': "Прогрессивный", 'B': "Регрессивный", 'C': "Импульсивный", 'D': "Экспрессивный",
            'F': "Мотивационо всеядный", 'G': "Мотивационо равнодушный"};
        const emotional = {'H': 1, 'I': 2, 'J': 3,
            'K': 4};
        code = code.substring(0,8);
        const emotionalGroup = emotional[code[7]];
        code = code.substring(0,7);
        const motivationProfile= {
            overall: motivation[code[0]],
            overallDorm: motivation[code[1]],
            overallTeaching: motivation[code[2]],
            dreamDorm:motivation[code[3]],
            realDorm:motivation[code[4]],
            dreamTeaching:motivation[code[5]],
            realTeaching:motivation[code[6]]
        };


        return {fullname,gender,faculty,groupFaculty,subGroupFaculty,emotionalGroup, motivationProfile};
    }catch (e){
        console.log(e)
    }
}
