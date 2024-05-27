import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";

// Ми мімікуємо використання React Router DOM
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("LoginPage", () => {
  it("renders login page components", () => {
    render(<LoginPage />);

    // Перевіряємо наявність компонентів GlobalHeader, LoginForm та GlobalFooter
    expect(screen.getByRole("heading", { name: /pool management/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /login/i })).not.toBeInTheDocument();
    expect(screen.getByText(/© 2024 Artem\. All rights reserved\./i)).toBeInTheDocument();
  });

  it("allows users to log in", () => {
    render(<LoginPage />);

    // Симулюємо введення ім'я користувача та пароля
    userEvent.type(screen.getByPlaceholderText("Ім'я користувача"), "testuser");

    userEvent.type(screen.getByPlaceholderText("Пароль"), "password123");


    // Симулюємо натискання кнопки входу
    userEvent.click(screen.getByText("Увійти"));


    // Перевіряємо, що користувач успішно ввійшов
    expect(screen.queryByText(/welcome, testuser/i)).not.toBeInTheDocument();
  });
});
