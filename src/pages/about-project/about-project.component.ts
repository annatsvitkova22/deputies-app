import { Component } from '@angular/core';

@Component({
    selector: 'app-about-project',
    templateUrl: './about-project.component.html'
})
export class AboutProjectComponent {
    text: string = "«СЛУГА ПОЛТАВИ. КОЖЕН З НАС - ДЕПУТАТ» - це додаток для громадян Полтавщини, що має на меті зменшити бар’єр між громадою та представниками влади.\n" +
      "Ми впевнені, що комунікація такого типу значно покращить взаємовідносини, допоможе в контролі за діями депутатів та підвищить рівень довіри громадян.\n" +
      "Відтепер чекати дні прийому громадян, стояти в черзі, збирати підписи не потрібно. Просто зареєструйтеся, відшукайте депутата у вашому районі та створіть запит онлайн.\n" +
      "Ви маєте можливість додати файли (як фотопідтвердження проблеми чи документи, що вже маєте) та коментар до запиту.\n" +
      "А також – можете спостерігати за процесом розгляду вашого запиту за допомогою функції «статус».\n" +
      "Давайте сприяти налагодженню комунікації у вертикалі «місцева влада – громада» з допомогою додатку «СЛУГА ПОЛТАВИ. КОЖЕН З НАС - ДЕПУТАТ» та розбудовувати свідоме громадянське суспільство разом."
    constructor(){}
}
