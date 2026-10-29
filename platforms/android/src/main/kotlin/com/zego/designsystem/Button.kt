package com.zego.designsystem

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

// Minimal Compose mirror of the Zego Button — enough for Code Connect to map the
// Figma props onto real Kotlin types. Replace with the real component library
// composable when this moves into the Android app. Mirrors the web
// button.figma.ts props: Hierarchy, Style, State.

enum class ButtonHierarchy { Primary, Secondary, Tertiary }

enum class ButtonStyleKind { Pill, Rounded, Fab, Text }

enum class ButtonState { Default, Hover, Active, Pressed, Focused, Disabled, Loading, Destructive }

@Composable
fun ZegoButton(
    label: String,
    hierarchy: ButtonHierarchy = ButtonHierarchy.Primary,
    style: ButtonStyleKind = ButtonStyleKind.Pill,
    state: ButtonState = ButtonState.Default,
    onClick: () -> Unit = {},
) {
    // Real fills/typography/shape per hierarchy, style and state are omitted —
    // this is a Code Connect reference component, not the shipping button.
    Button(onClick = onClick, enabled = state != ButtonState.Disabled && state != ButtonState.Loading) {
        Text(label)
    }
}

// Code Connect — Button (Jetpack Compose)
// Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=85-78500
@FigmaConnect(url = "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=85-78500")
class ButtonDoc {
    @FigmaProperty(FigmaType.Enum, "Hierarchy")
    val hierarchy = Figma.mapping(
        "Primary" to ButtonHierarchy.Primary,
        "Secondary" to ButtonHierarchy.Secondary,
        "Tertiary" to ButtonHierarchy.Tertiary,
    )

    @FigmaProperty(FigmaType.Enum, "Style")
    val style = Figma.mapping(
        "Pill" to ButtonStyleKind.Pill,
        "Rounded" to ButtonStyleKind.Rounded,
        "FAB" to ButtonStyleKind.Fab,
        "Text" to ButtonStyleKind.Text,
    )

    // "Dissabled" is the (sic) spelling of the State value in the Figma component.
    @FigmaProperty(FigmaType.Enum, "State")
    val state = Figma.mapping(
        "Default" to ButtonState.Default,
        "Hover" to ButtonState.Hover,
        "Active" to ButtonState.Active,
        "Pressed" to ButtonState.Pressed,
        "Focused" to ButtonState.Focused,
        "Dissabled" to ButtonState.Disabled,
        "Loading" to ButtonState.Loading,
        "Destructive" to ButtonState.Destructive,
    )

    @Composable
    fun Example() {
        ZegoButton("Button", hierarchy = hierarchy, style = style, state = state)
    }
}
