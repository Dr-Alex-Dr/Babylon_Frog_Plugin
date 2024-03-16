import { Subscription, debounceTime, every, first, fromEvent, map } from "rxjs";

let globalText: string;
let globalRange: Range;
let currentEvent: Event;


const translateImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAmCAYAAAC29NkdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAODSURBVHgB7ZZ7SFR5FMe/v3G683K09OZWO5rumoqzuTWB7paxyS7ORvYmIyoKC6nAKCqyF00KFRhUQg9DirSgqOgJkVBWDEYPgqKCMntnWeOkOZqNjqefU03eLMO5QwTdD8wf8/2dOfOdc8/5nQEUFBQUfm4YZEI5q0NQdS8Ojob77NKRWvxI0J+j0khvPkba+MukT6yguH/nEZEKAcTvZNyIBs9fzIHH0w/EGDxtAh4+nYycNX0QQPz/tTdvEtwe+kw1oM7RGwHEf4NmM0HsVSPR9FoHMtMrPw/l1fa71/02yBhrwTjrbhh0jV5BrXLin79XsDFjmnzGpuaYKGZ4HiKHlZJl9HLKXtAX3xsaOn4saRMqKGXCKokOm4pEy0bSJFzxvX4bsa671ZQ/cfsLyyCG3YVOOCnRB5xNwmvXMIn2rOYvlJXp0Q3kGzSZGH/ewXhV75Ho4WGGTtdsG+qQnt6EbiDfYMX1YD4FofyaiZHoLKhFmp2aYdQf4L1L6AbqbwVQSYkBxcdTUF0bD6O2DgNjyljJlk8bgzW2oqm5BcG6vu391W6AE4S4/zIgaOoRajyD5jcqhIvlyJt9BZmZCChkTFri3RQfGz0k6SgtzDP7zm0FERRsPk1Rw3fR48c6unFDoMjULDIkFtP0xTGQSZePmEbY1HC/TfNuio+8df+KU/YZVF7+vvrJKcQr1QZH7QBMmj8NGXPy8bJ2OhKT1rDSDfchky5HngoLNcgt2svXWXSnQ0GoRkTYeX6fuPCkehaY6lOuPuJZ9tC+uFM+u92I3E1D4HSqsHHpRWa1NkKOQW/SxPQs3H00l0e+jzXo7kGnucPXXCzqG3736R2JNp3BvoK1GDSogfekd7opY5GIaxX5qHFa+NsgRPW7ioHxK9nh7S/kGays1OD/rJFwtyVD6HEbxasPsbQ0l3cQLBkLcKtqyhc/qGJu9AhyQKd/AJ3WA4czGi2tkZKYX8RS9si+GXIM+ox+mFCJtr4oCmu37OB9KXYM5BWsQqjhNL96WtH4JgSOujg0uJLb96Mkac/Qq6zmYjYCYfCrxq2zYnHuwlQI6lSo1U7E9j+InUUn2R8Rrg6eGUxDc+F4NbHDN/M/G+Ie9qTrCgYMKtgWQXtP9Prq+eBJvSl88FbvVSUkXKD+qfk0bmZP/EiQzaamIVYLZS9L4FX95pJQUFBQUFCQzzvYslWi7bTG4AAAAABJRU5ErkJggg=='

const donateImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAqCAYAAADBNhlmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQQSURBVHgB7ZZ9bBNlHMefp3fX97XroC+w0TqgGh0C0QVIYCLVOc18IdXtj0UBWZlhukkJAwNLyCSa/WE2UoOKbMY4jbpEBYMj06BDx0LIJksaXAWhK6bb2u6t7Xp9ufYe75RqW6GUbTUm3Oefu/u93H3v9zzP73kA4ODg4ODg4JhPEEKExXJZwFxhJvEZBc0HjCDM2DBeYR+htvuDQLJEBS+UrhO2HXhRMQj+C4FsRXa8OXW/zUGVCIU4eXeB4NQ7e6Vjcb/p0NTDpwcCzRBAPG6TiuH4F02LKvV66APZFMhW56ndni224UgNjSBx3ThduBjr2PwQ/t2ZC/Be69XwfioK5KmpzxjEe1rrFWdu9m4czAPGfROGi1cjL0H4T3UAhLn2Ubru8OeROnSzRAiRVgO8IA08MEdaOiZLbPZwQ5K46yCIaKEAOZZoeL/gBAyk+iVCZN1VkWtN9/5bVrDMPLpm1IV2QIDUMilxrmwN/kmjKc/R0vm76PRZ/rNtJ0NbwxRQ3Cj3LhU++FotMD+2Uk2aW72FP/8aqiLD9IMY4HnCVKyn6lHie+bHYum+n3YONlhcy47/GH03FgV5cZuAgH69Fnc4RqJyX5DOJzAwLpdiY94ArY9GgSgxP1eK9Q50qPcwIqJglqQd4u6+aHmiOJYwhXKsV6gisYhnMxTnvPKDJf+58x9qTHod0cn6FyrgxXt0RDdANPKR0bVHvwoUgTmQVmCEThYXZ/1q/qm+dnVTe6P8fH4+JJkK0TEKSFhfaTF+rOuw8lCBht9P05D46KTvEZAtgVol7xpzSVqEzMSPLNdJP2BEhRLt7klqQY4YBl+tAIOsr7pM1Mg82yb96PGjX/sWgmwIbDmo6dQuwnoRM15/WSB5nw5rO7hN6EiM6zo3IZueAatxnPetUqn8c7VuNcom1q0QfByOoJzPusgqkC2YJswz1LiWrXze+YCl069M3UPNLaHlG6rHmpdudvZv2jlWk5KLP1HveV1vHOkprfeYjvcGFoPbZE47yfrtzg2uaXiAppGSfZZLecOmp7FtL1eqZuIx5WZ3yZCdamXvRXyet0BNHKm2LDhReYv2EmfWjbr7rF/l8qL9cXEs3hla1zOAb0yMy5XAv7e3YISWX74W3v1ercfIbo+ZfGfWAo98Sa6iY1CVYoaXnMHCRMPQMJU8rBAIh0cju5re9ytANgWWrRXaMQySqXaRAEta3ZMzNxpJKPj0myk+yIBZC6ytkF1RKVAXSGhDAhwObVolOZEYt2Kp4F+HAbEQ/Na+V+sHGTCnRdLvROLmtz3lZAgVTfuA9YUn0U87jRp3YozbjaRb3vDsu+SgDEx/pPJkoG9jsejYW3UKO/i/wLaqOuaYfztHfQ4ODg4OjjuEPwDJMJbTFqGW2wAAAABJRU5ErkJggg=='

fromEvent(document, 'mouseup')
.pipe(
  debounceTime(200),
  map((event: MouseEvent) => event)
)
.subscribe((event) => { 
  const selectedText = document.getSelection().toString();
  
  if (selectedText.length > 0) {
    const parent: any = (event.target as HTMLElement).closest('[contenteditable="true"], [role="textbox"], textarea, input');
    
    // смотрим наличие формы ввода, удаляем все переносы и смотьрим наличие выделенной строки в форме
    if (parent && parent.textContent.replace(/\n/g, "").includes(selectedText.replace(/\n/g, "")) || parent && parent.value.replace(/\n/g, "").includes(selectedText.replace(/\n/g, ""))) {

      createTranslateButton(event)
      globalText = document.getSelection().toString();
      globalRange = document.getSelection().getRangeAt(0);
      currentEvent = event;
    }
  }
})

function createTranslateButton(event: MouseEvent): void {
  const {pageX, pageY} = event;

  const button = document.createElement('div');
  button.classList.add('translate-contaeiner');
  button.innerHTML = `
    <div class="but-wrapper">
      <img class="but-img translate-img" src=${translateImg} alt="">
      <p class="but-text">Translate</p>
    </div>
    <a class="but-donate" href="https://boosty.to/bfrog/donate">
      <img class="but-img donate-img" src=${donateImg} alt="">
    </a>
  `
  button.style.left = `${pageX - 50}px`;
  button.style.top = `${pageY - 50}px`;

  document.querySelector('body').appendChild(button);

  const buttonSubscription = fromEvent(document.querySelector('.but-wrapper'), 'click').subscribe(async () => {
    await translatetext()

    button.remove();

    buttonSubscription.unsubscribe();
    documentCanvas.unsubscribe();
  })

  const documentCanvas = fromEvent(document, 'click')
  .subscribe(() => {
    button.remove();

    buttonSubscription.unsubscribe();
    documentCanvas.unsubscribe();
  })

}


// Получаем переведенный текст и заменяем им исходный
async function translatetext(): Promise<void> {
  const language = document.documentElement.lang || 'en';

  console.log(globalText, language)

  chrome.runtime.sendMessage({translateText: globalText.toString(), language: language}, (response) => {
    updateInputForm(response)
  });
}

function updateInputForm(data: string) {
  const domInput: any = (currentEvent.target as HTMLElement).closest('[contenteditable="true"], [role="textbox"]');

  const textInput: any = (currentEvent.target as HTMLElement).closest('textarea, input'); 
  
  console.log(domInput, textInput)
  if (domInput) {
    const range = globalRange
    range.deleteContents(); 
      
    const textNode = document.createTextNode(data);
    range.insertNode(textNode);
  }

  if (textInput) {
    const start = textInput.selectionStart;
    const end = textInput.selectionEnd;
    const value = textInput.value;
    textInput.value = value.substring(0, start) + data + value.substring(end);

    // textInput.setRangeText(data)
  } 
}

// // Передаем язык старницы в popup
// const pageLanguage = document.documentElement.lang || 'en';

// chrome.runtime.sendMessage({pageLanguage: 'en'}, (response) => {
//   console.log(response)
// });



function printLine(text: any) {
  chrome.runtime.sendMessage({consoleText: text}, function(response) {
    console.log(response);
  });  
}





