import {Component} from '@angular/core';
// import {basic} from "@awade/basics";

// const data = require("./data.json");

@Component({
    selector: 'jigsaw-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor() {
        console.log('333ffff33ffffffffffffffffffffffff3fj33333');
        // basic('xxxxxxxxxxxxxxxxxxxxxxxxx')
    }
    nextPinyin() {
        const pinyins = this.selectedInitials.concat(...this.selectedVowels).concat(...this.selectedWholeTone);
        const pinyin = pinyins[this._random(0, pinyins.length - 1)].toString();
        const [array, toneArray] = this._getToneArray(pinyin);
        if (!array || !toneArray) {
            console.error('can not find tone array for ' + pinyin);
        }

        console.log('random pinyin is ' + pinyin);
        const tone = this.selectedTones.length > 0 ?
            this.selectedTones[this._random(0, this.selectedTones.length - 1)] : {index: 0};
        const index = array.findIndex(item => item === pinyin) * 5 + tone.index;
        this.pinyin = toneArray[index];
    }

    pinyin = 'ǔ';

    initials = [
        'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j',
        'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'
    ];
    initialsWithTone = this.initials.reduce((all, item) => {
        all.push(item, item, item, item, item);
        return all;
    }, []);
    selectedInitials = [];

    vowels = [
        'a', 'o', 'e', 'i', 'u', 'ü', 'ai', 'ei', 'ui', 'ao', 'ou',
        'iu', 'ie', 'üe', 'er', 'an', 'en', 'in', 'un', 'ün', 'ang',
        'eng', 'ing', 'ong', 'iao'
    ];
    vowelsWithTone = [
        'a', 'ā', 'á', 'ǎ', 'à',
        'o', 'ō', 'ó', 'ǒ', 'ò',
        'e', 'ē', 'é', 'ě', 'è',
        'i', 'ī', 'í', 'ǐ', 'ì',
        'u', 'ū', 'ú', 'ǔ', 'ù',
        'ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ',
        'ai', 'āi', 'ái', 'ǎi', 'ài',
        'ei', 'ēi', 'éi', 'ěi', 'èi',
        'ui', 'ūi', 'úi', 'ǔi', 'ùi',
        'ao', 'āo', 'áo', 'ǎo', 'ào',
        'ou', 'ōu', 'óu', 'ǒu', 'òu',
        'iu', 'īu', 'íu', 'ǐu', 'ìu',
        'ie', 'īe', 'íe', 'ǐe', 'ìe',
        'üe', 'ǖe', 'ǘe', 'ǚe', 'ǜe',
        'er', 'ēr', 'ér', 'ěr', 'èr',
        'an', 'ān', 'án', 'ǎn', 'àn',
        'en', 'ēn', 'én', 'ěn', 'èn',
        'in', 'īn', 'ín', 'ǐn', 'ìn',
        'un', 'ūn', 'ún', 'ǔn', 'ùn',
        'ün', 'ǖn', 'ǘn', 'ǚn', 'ǜn',
        'ang', 'āng', 'áng', 'ǎng', 'àng',
        'eng', 'ēng', 'éng', 'ěng', 'èng',
        'ing', 'īng', 'íng', 'ǐng', 'ìng',
        'ong', 'ōng', 'óng', 'ǒng', 'òng',
        'iao', 'iāo', 'iáo', 'iǎo', 'iào',
    ];
    selectedVowels = [];

    wholeSyllable = [
        'zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si', 'yi', 'wu', 'yu',
        'ye', 'yue', 'yuan', 'yin', 'yun', 'ying'
    ];
    wholeSyllableWithTone = [
        'zhi', 'zhī', 'zhí', 'zhǐ', 'zhì',
        'chi', 'chī', 'chí', 'chǐ', 'chì',
        'shi', 'shī', 'shí', 'shǐ', 'shì',
        'ri', 'rī', 'rí', 'rǐ', 'rì',
        'zi', 'zī', 'zí', 'zǐ', 'zì',
        'ci', 'cī', 'cí', 'cǐ', 'cì',
        'si', 'sī', 'sí', 'sǐ', 'sì',
        'yi', 'yī', 'yí', 'yǐ', 'yì',
        'wu', 'wū', 'wú', 'wǔ', 'wù',
        'yu', 'yū', 'yú', 'yǔ', 'yù',
        'ye', 'yē', 'yé', 'yě', 'yè',
        'yue', 'yūe', 'yúe', 'yǔe', 'yùe',
        'yuan', 'yuān', 'yuán', 'yuǎn', 'yuàn',
        'yin', 'yīn', 'yín', 'yǐn', 'yìn',
        'yun', 'yūn', 'yún', 'yǔn', 'yùn',
        'ying', 'yīng', 'yíng', 'yǐng', 'yìng'
    ];
    selectedWholeTone = [];

    tones = [
        {label: '轻声', index: 0},
        {label: 'ˉ', index: 1},
        {label: 'ˊ', index: 2},
        {label: 'ˇ', index: 3},
        {label: 'ˋ', index: 4}
    ];
    selectedTones = [];

    private _random(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    private _getToneArray(pinyin) {
        if (this.initials.find(item => item == pinyin)) {
            return [this.initials, this.initialsWithTone];
        }
        if (this.vowels.find(item => item == pinyin)) {
            return [this.vowels, this.vowelsWithTone];
        }
        if (this.wholeSyllable.find(item => item == pinyin)) {
            return [this.wholeSyllable, this.wholeSyllableWithTone];
        }
    }
}
