### JONA Frontend Design Pattern

#### Introduction

In frontend web development, it's common to encounter the need for creating consistent and reusable user interfaces (UIs). To address this challenge, we propose a frontend design pattern called "JONA," which focuses on creating modular and maintainable UIs in the context of web applications.

#### Pattern Description

The JONA design pattern consists of three main components: an interface, a template class, and an implementation class. These components are designed to work together and provide a flexible structure for developing UIs on the frontend.

1. **Interface**: The interface defines a set of methods that represent the functionalities of the UI. These methods may include actions such as logging in, creating an account, recovering a password, among others. The interface acts as a contract that specifies how components implementing the interface should interact.

2. **Template Class**: The template class implements the interface and provides a basic implementation of the methods defined in it. This class may contain common or generic logic needed for the UI, such as creating HTML elements and handling events. The template class serves as a starting point for specific implementations of the interface.

3. **Implementation Class**: The implementation class extends the template class and provides a concrete implementation of the methods defined in the interface. This class is responsible for customizing the UI logic according to the specific requirements of the application. For example, it may include calls to web services to perform actions like logging in or recovering passwords.

#### Example Application

To illustrate the use of the JONA design pattern, let's consider a common use case: the login interface in a web application.

1. **Interface**: We define an interface called `InterUiLogin` that includes methods such as `login`, `goToCreateAccount`, `goToRecoverPassword`, and `isValidData`.

2. **Template Class**: We create a template class called `UiLogin` that implements the `InterUiLogin` interface. This class provides a basic implementation of the interface methods, such as creating HTML elements for the login form and handling events.

3. **Implementation Class**: Next, we create an implementation class called `UiLoginImpl` that extends the `UiLogin` template class. This class overrides the methods of the template class to provide a specific implementation of the login interface, such as validating credentials and communicating with the server.

#### Conclusion

The JONA frontend design pattern offers an organized and modular structure for developing user interfaces on the frontend of web applications. By separating common logic from application-specific logic, this pattern facilitates code reuse, extensibility, and maintenance. By adopting the JONA pattern, developers can create robust and scalable UIs that meet the changing needs of modern web applications.

