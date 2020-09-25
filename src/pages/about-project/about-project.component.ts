import { Component } from '@angular/core';

@Component({
    selector: 'app-about-project',
    templateUrl: './about-project.component.html'
})
export class AboutProjectComponent {
    text: string = "Чому Генеральна прокуратура України не відреагувала на пропозицію Лукашенка прибути до Мінська, щоб довести причетність цих найманців до участі в агресі. Існує багато варіацій уривків з Lorem Ipsum, але більшість з них зазнала певних змін на кшталт жартівливих вставок або змішування слів, які навіть не виглядають правдоподібно"
    constructor(){}
}
