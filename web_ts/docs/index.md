---
layout: default
title: Inicio
nav_order: 1
description: "Documentación oficial del Patrón JONA — arquitectura frontend multi-tecnología"
permalink: /
---

# Patrón JONA
{: .fs-9 }

Una arquitectura frontend que separa **contratos**, **estado**, **lógica** y **UI** en capas independientes, implementada en múltiples tecnologías.
{: .fs-6 .fw-300 }

[Ver el patrón]({{ site.baseurl }}/patron){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHub](https://github.com/Jofrantoba-Coding/patron-frontend-jona){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## ¿Qué es el Patrón JONA?

El **Patrón JONA** es una arquitectura de separación de responsabilidades para interfaces de usuario. Su objetivo es que cada capa tenga **una sola razón para cambiar**, permitiendo que distintos roles (diseñador, frontend, integrador) trabajen de forma paralela sin pisarse.

El patrón se organiza en **5 capas fundamentales** en su forma completa:

| Capa | Archivo típico | Responsabilidad |
|------|---------------|-----------------|
| **Interfaz / Contrato** | `InterUiHome.ts` | Define *qué* hace la vista (métodos públicos) |
| **Template** | `UiHomeTemplateModel.ts` | Estado UI base, implementación placeholder |
| **Implementación** | `UiHomeImpl.ts` | Lógica real, servicios, navegación |
| **Visual** | `UiHome.tsx` | Solo JSX/template, sin lógica |
| **View / Orquestador** | `UiHomeView.tsx` | Conecta implementación con visual |

---

## Implementaciones disponibles

Este repositorio demuestra el patrón JONA en **8 tecnologías diferentes**:

<div class="grid">

  <div class="card">
    <h3>⚛️ React Hooks</h3>
    <p>Implementación principal con hooks funcionales y composición.</p>
    <a href="{{ site.baseurl }}/implementaciones/react-hooks.html">Ver documentación →</a>
  </div>

  <div class="card">
    <h3>📖 React Hooks Codex</h3>
    <p>Variante extendida con 6 capas, storage y guía interactiva del patrón.</p>
    <a href="{{ site.baseurl }}/implementaciones/react-hooks-codex.html">Ver documentación →</a>
  </div>

  <div class="card">
    <h3>🏗️ React System Design</h3>
    <p>Integración con design system y componentes de Lucide.</p>
    <a href="{{ site.baseurl }}/implementaciones/react-systemdesign.html">Ver documentación →</a>
  </div>

  <div class="card">
    <h3>🅰️ Angular</h3>
    <p>Standalone components con RxJS. El patrón se mapea a componentes Angular.</p>
    <a href="{{ site.baseurl }}/implementaciones/angular.html">Ver documentación →</a>
  </div>

  <div class="card">
    <h3>💚 Vue.js</h3>
    <p>Composition API con composables. Los hooks se convierten en <code>use*()</code>.</p>
    <a href="{{ site.baseurl }}/implementaciones/vuejs.html">Ver documentación →</a>
  </div>

  <div class="card">
    <h3>⚛️ React Class + Refs</h3>
    <p>Componentes de clase con <code>createRef</code> para inputs no controlados.</p>
    <a href="{{ site.baseurl }}/implementaciones/react-refs.html">Ver documentación →</a>
  </div>

  <div class="card">
    <h3>⚛️ React Class + State/Props</h3>
    <p>Componentes de clase con estado controlado y props tipadas.</p>
    <a href="{{ site.baseurl }}/implementaciones/react-state-props.html">Ver documentación →</a>
  </div>

  <div class="card">
    <h3>🟦 TypeScript Puro</h3>
    <p>Sin framework. Manipulación directa del DOM con clases TypeScript.</p>
    <a href="{{ site.baseurl }}/implementaciones/typescript-puro.html">Ver documentación →</a>
  </div>

</div>

---

## Design System: jona-ui

La librería de componentes **`jona-ui`** aplica el mismo patrón JONA a nivel de componentes atómicos, moléculas y organismos.

[Ver jona-ui →]({{ site.baseurl }}/uijona){: .btn .btn-outline }

---

## Principios del patrón

1. **La interfaz define el contrato** — el visual y la lógica se acoplan solo a ella
2. **La implementación extiende, no modifica** — el template es el punto de partida
3. **El visual es puro** — solo recibe props, no tiene imports de servicios ni hooks de lógica
4. **El View es el único punto de entrada** — el router solo conoce Views
5. **La lógica de negocio vive en la implementación** — no en el visual ni en el template
