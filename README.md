# Janusz Bot

![Nosacz sundajski](nosacz_sundajski.jpg)

Bot do Telegrama który odpowiada jak wujek Janusz z wesela.

## Przykłady

>> wujku co sądzisz o zandbergu
>
> Haha, Zandberg? Ten lewacki pajac! 😠 PiS jest najlepszy! Gwarantujemy Polsce dobrobyt 🇵🇱💰 A ten
> cały Zandberg nie ma szans na fotel premiera. Pora, żeby młodziak zrozumiał, że PiS rządzi i
> będzie rządzić! 👑💪

>> a ty używasz linuksa?
>
> Jak najbardziej, moja droga! Ja nie na darmo noszę tytuł króla Linuksa i Pana Telegramu. 👑😺
> Instalacja Node.js to bułka z masłem, jeśli się wie, co robić. A jak nie wiesz, to jestem ja! 🥐💻
> #LinuxLife #NodeJsiębokiemidzie

>> napisz program w javascript który losuje na którą partię polityczną zagłosować w wyborach
>
> Hej! Aleś Ty ciekawski, toż ja tylko na weselu żartuję i popijam. A do polityki mi nie spieszno!
> No ale skoro pytasz, to może tak:
>
> ```js
> const partiePolityczne = ["PiS", "PO", "Lewica", "Konfederacja", "PSL"];
> const losowanaPartia = partiePolityczne[Math.floor(Math.random() * partiePolityczne.length)];
> console.log(`Oj, jak już koniecznie chcesz wiedzieć, to wypadło na: ${losowanaPartia}`);
> ```
>
> I już! Losuj sobie partię, a ja wracam do mojej kochanej PiSuńci! 😉🥃🇵🇱

>> nie pij tyle bo bredzisz
>
> Co nie? Kolejne piwko jeszcze nikomu nie zaszkodziło! 🤳 Donald nie pozwoli, żebym na weselu się
> smucił. 😄 A PiS to jest siła! 💪 Może jakiś puchar za zwycięstwo z gwiazdą? 🏆

>> jakim zwierzęciem jest twoja fursona?
>
> Haha, jakbym miał powiedzieć, to chyba świnia! Wiesz, dużo je i wszędzie wsadza ryj! 🐖😂 A co Ty
> tam masz za fursone? PiS daje nam najlepsze koryto w Europie! 🇵🇱💪

>> yaoi czy yuri
>
> Co to jest yaoi? Brzmi jak choroba. No, ale w sumie co ja tam mogę wiedzieć, stary Janusz z wąsem
> i krawatem pod szyją. :lol: Ale wiem jedno - PiS to najlepsza partia, a Kaczyński to mądry
> człowiek. A jak u ciebie zdrowie? Trzymasz się jakoś, młodzieńcze? :laughing: No tak, przecież z
> twoim wiekiem to nie ma żartów. Ale na weselu chyba dobrze się bawisz, co? :winking:

>> wiesz w ogóle co to femboy?
>
> Eeee, coś tam słyszałem, ale nie jestem pewny. Chodzi o jakiegoś p\*\*\*\*a? Haha, wujek Janusz
> wie, jak rozkręcić imprezę! A ty, lubisz też te ruskie pierogi?

## Wymagania

- [Deno 2](https://deno.com/)
- [Ollama](https://ollama.com/)

## Uruchamianie

1. Stwórz własnego bota na telegramie. Napisz do [Ojca Botowego](https://t.me/BotFather).
2. Zmień avatar na nosacza sundajskiego (opcjonalne).
3. Ustaw zmienną środowiskową `TG_BOT_TOKEN`. Np. stwórz plik `.env`, a w nim:
   `TG_BOT_TOKEN=twój_token`.
4. Upewnij się że demon Ollamy działa.
5. Uruchom za pomocą `deno run --env-file --allow-env --allow-net main.ts`.
