// Zego Design System — Android (Jetpack Compose) Code Connect.
//
// Reference build file. In the real Android app, apply the Code Connect plugin +
// dependency inside the existing Compose module (which already brings the Android
// Gradle plugin, Kotlin and the Compose runtime) rather than standing this up on
// its own. The three lines that matter are the plugin id, the version set, and
// the code-connect-lib dependency.
plugins {
    // Code Connect Gradle plugin (parses @FigmaConnect classes and publishes them)
    id("com.figma.code.connect") version "1.+"

    // Present in a real Compose module — needed to compile the @Composable examples:
    // id("com.android.library")
    // id("org.jetbrains.kotlin.android")
    // id("org.jetbrains.kotlin.plugin.compose")
}

dependencies {
    implementation("com.figma.code.connect:code-connect-lib:1.+")

    // Compose runtime/material, provided by the host module in a real project:
    // implementation(platform("androidx.compose:compose-bom:…"))
    // implementation("androidx.compose.material3:material3")
}

// Compatible set per the Figma docs at time of writing:
//   com.figma.code.connect plugin 1.2.9 · code-connect-lib 1.1.3 · Kotlin 2.2.10
