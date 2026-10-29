import Figma
import SwiftUI

// Code Connect — Button (SwiftUI)
// Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=85-78500
//
// Mirrors components/button/button.figma.ts (web): the Figma Hierarchy, Style and
// State variant properties map onto the SwiftUI ButtonHierarchy / ButtonStyleKind
// / ButtonState enums, and `body` is the snippet Dev Mode shows for iOS.
struct Button_connection: FigmaConnect {
    let component = ZegoButton.self
    let figmaNodeUrl = "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=85-78500"

    @FigmaEnum("Hierarchy", mapping: [
        "Primary": ButtonHierarchy.primary,
        "Secondary": ButtonHierarchy.secondary,
        "Tertiary": ButtonHierarchy.tertiary,
    ])
    var hierarchy: ButtonHierarchy = .primary

    @FigmaEnum("Style", mapping: [
        "Pill": ButtonStyleKind.pill,
        "Rounded": ButtonStyleKind.rounded,
        "FAB": ButtonStyleKind.fab,
        "Text": ButtonStyleKind.text,
    ])
    var style: ButtonStyleKind = .pill

    // "Dissabled" is the (sic) spelling of the State value in the Figma component.
    @FigmaEnum("State", mapping: [
        "Default": ButtonState.default,
        "Hover": ButtonState.hover,
        "Active": ButtonState.active,
        "Pressed": ButtonState.pressed,
        "Focused": ButtonState.focused,
        "Dissabled": ButtonState.disabled,
        "Loading": ButtonState.loading,
        "Destructive": ButtonState.destructive,
    ])
    var state: ButtonState = .default

    var body: some View {
        ZegoButton("Button", hierarchy: hierarchy, style: style, state: state)
    }
}
