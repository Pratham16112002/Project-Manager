// autobind function

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function Validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length <= validatableInput.maxLength;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  return isValid;
}

function autobind(_1: unknown, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const bound_fn = originalMethod.bind(this);
      return bound_fn;
    },
  };
  return adjDescriptor;
}
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  constructor(private type: "active" | "finished") {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-list")
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app");
    const importNode = document.importNode(this.templateElement.content, true);
    this.element = <HTMLElement>importNode.firstElementChild;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    const importNode = document.importNode(this.templateElement.content, true);
    this.element = <HTMLFormElement>importNode.firstElementChild;
    this.element.id = "user-input";
    this.titleInputElement = <HTMLInputElement>(
      this.element.querySelector("#title")
    );
    this.descriptionInputElement = <HTMLInputElement>(
      this.element.querySelector("#description")
    );
    this.peopleInputElement = <HTMLInputElement>(
      this.element.querySelector("#people")
    );
    this.attach();
    this.configure();
  }
  private getUserInputData(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      maxLength: 30,
      minLength: 1,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      maxLength: 100,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: parseInt(enteredPeople),
      required: true,
      max: 999,
      min: 0,
    };
    if (!Validate(titleValidatable)) {
      alert("Invalid, Enter a valid title please");
      this.clearInput();
      return;
    }
    if (!Validate(descriptionValidatable)) {
      alert("Invalid, Enter the description properly");
      this.clearInput();
      return;
    }
    if (!Validate(peopleValidatable)) {
      alert("Invalid, Number of peoples!");
      this.clearInput();
      return;
    }
    if (
      enteredTitle.trim().length == 0 ||
      enteredDescription.trim().length == 0 ||
      enteredPeople.trim().length <= 0
    ) {
      return;
    }
    return [enteredTitle, enteredDescription, parseInt(enteredPeople)];
  }
  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.getUserInputData();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInput();
    }
  }
  private clearInput() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
