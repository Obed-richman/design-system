// swift-tools-version: 5.9
import PackageDescription

// Zego Design System — iOS (SwiftUI) Code Connect.
// A tiny Swift package whose only job is to hold the SwiftUI reference
// components and their Figma Code Connect mappings so they can be published to
// Design-System-003. In the real iOS app this lives in the component library
// target instead.
let package = Package(
    name: "ZegoDesignSystem",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "ZegoDesignSystem", targets: ["ZegoDesignSystem"]),
    ],
    dependencies: [
        // The Code Connect Swift package provides the `Figma` module
        // (FigmaConnect protocol + @FigmaEnum/@FigmaString/@FigmaBoolean …).
        .package(url: "https://github.com/figma/code-connect", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "ZegoDesignSystem",
            dependencies: [
                .product(name: "Figma", package: "code-connect"),
            ]
        ),
    ]
)
