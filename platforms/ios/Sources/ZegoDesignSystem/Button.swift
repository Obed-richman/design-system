import SwiftUI

// Minimal SwiftUI mirror of the Zego Button — enough for Code Connect to map
// the Figma props onto real Swift types. Replace with the real component library
// view when this moves into the iOS app. Mirrors the web button.figma.ts props:
// Hierarchy, Style, State.

public enum ButtonHierarchy { case primary, secondary, tertiary }

public enum ButtonStyleKind { case pill, rounded, fab, text }

public enum ButtonState {
    case `default`, hover, active, pressed, focused, disabled, loading, destructive
}

public struct ZegoButton: View {
    private let label: String
    private let hierarchy: ButtonHierarchy
    private let style: ButtonStyleKind
    private let state: ButtonState
    private let action: () -> Void

    public init(
        _ label: String,
        hierarchy: ButtonHierarchy = .primary,
        style: ButtonStyleKind = .pill,
        state: ButtonState = .default,
        action: @escaping () -> Void = {}
    ) {
        self.label = label
        self.hierarchy = hierarchy
        self.style = style
        self.state = state
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            if state == .loading {
                ProgressView()
            } else {
                Text(label)
            }
        }
        .disabled(state == .disabled || state == .loading)
        // Real fills/typography/shape per hierarchy, style and state are omitted —
        // this is a Code Connect reference component, not the shipping button.
    }
}
