"use client";

import { useState, useRef } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { useToast } from "../Toast";

import { Modal, useModal } from "./index";
import type { ModalVariants, ModalHandle } from "./index";

// Example 1: Basic Modal
export function BasicModalExample() {
  const { info } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    info("Action Confirmed", "The basic modal action was confirmed");
    setIsOpen(false);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Basic Modal</h4>

      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">Basic Modal</h2>
          </Modal.Header>

          <Modal.Body>
            <p className="text-sm text-on-muted">
              This is a basic modal example with standard functionality.
              You can close it using the X button, clicking the backdrop, or pressing Escape.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Close>
              <Button variant="outline">Cancel</Button>
            </Modal.Close>
            <Button onClick={handleConfirm}>Confirm</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 2: Modal Sizes
export function ModalSizesExample() {
  const sizes: Array<ModalVariants["size"]> = ["xs", "sm", "md", "lg", "xl", "full", "auto"];
  const [currentSize, setCurrentSize] = useState<ModalVariants["size"] | null>(null);

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Modal Sizes</h4>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant="outline"
            size="sm"
            onClick={() => setCurrentSize(size)}
          >
            {size.toUpperCase()}
          </Button>
        ))}
      </div>

      <Modal open={currentSize !== null} onOpenChange={() => setCurrentSize(null)} size={currentSize || "md"}>
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">{currentSize?.toUpperCase()} Modal</h2>
          </Modal.Header>

          <Modal.Body>
            <p className="text-sm text-on-muted">
              This is a {currentSize} sized modal. Each size provides different dimensions for various use cases.
              {currentSize === "full" && " The full size modal takes up the entire viewport."}
              {currentSize === "xs" && " The extra small modal is perfect for simple alerts."}
              {currentSize === "auto" && " The auto size modal adjusts to its content."}
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Close>
              <Button variant="outline">Close</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 3: Modal Variants
export function ModalVariantsExample() {
  const variants: Array<ModalVariants["variant"]> = ["default", "centered", "drawer", "fullscreen", "popup"];
  const [currentVariant, setCurrentVariant] = useState<ModalVariants["variant"] | null>(null);

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Modal Variants</h4>

      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <Button
            key={variant}
            variant="outline"
            size="sm"
            onClick={() => setCurrentVariant(variant)}
          >
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>

      <Modal
        open={currentVariant !== null}
        onOpenChange={() => setCurrentVariant(null)}
        variant={currentVariant || "default"}
        size={currentVariant === "fullscreen" ? "full" : "md"}
      >
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">{currentVariant} Modal</h2>
          </Modal.Header>

          <Modal.Body>
            <p className="text-sm text-on-muted">
              This modal uses the "{currentVariant}" variant style.
              {currentVariant === "drawer" && " Drawer modals slide up from the bottom."}
              {currentVariant === "fullscreen" && " Fullscreen modals take over the entire screen."}
              {currentVariant === "popup" && " Popup modals appear near the top with extra shadow."}
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Close>
              <Button variant="outline">Close</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 4: Imperative Modal API
export function ImperativeModalExample() {
  const { info, success } = useToast();
  const modalRef = useRef<ModalHandle>(null);
  const { isOpen, open, close, toggle, modalRef: hookModalRef } = useModal();

  const handleImperativeAction = () => {
    modalRef.current?.open();
    info("Modal Opened", "Modal was opened using imperative API");
  };

  const handleHookAction = () => {
    toggle();
    info("Modal Toggled", `Modal ${isOpen ? "closed" : "opened"} using hook API`);
  };

  const handleConfirm = () => {
    success("Confirmed", "Action confirmed via imperative modal");
    close();
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Imperative Modal API</h4>

      <div className="space-y-4">
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-on-muted">Direct Reference</h5>
          <Button onClick={handleImperativeAction} variant="outline">
            Open via Ref
          </Button>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-medium text-on-muted">useModal Hook</h5>
          <Button onClick={handleHookAction} variant="outline">
            {isOpen ? "Close" : "Open"} via Hook
          </Button>
        </div>
      </div>

      {/* Direct reference modal */}
      <Modal ref={modalRef}>
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">Imperative Modal</h2>
          </Modal.Header>

          <Modal.Body>
            <p className="text-sm text-on-muted">
              This modal was opened using the imperative API through a ref.
              You can control it programmatically without managing state.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Close>
              <Button variant="outline">Cancel</Button>
            </Modal.Close>
            <Button onClick={() => {
              success("Ref Modal", "Confirmed via ref modal");
              modalRef.current?.close();
            }}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Hook-based modal */}
      <Modal ref={hookModalRef} open={isOpen} onOpenChange={(open) => !open && close()}>
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">Hook Modal</h2>
          </Modal.Header>

          <Modal.Body>
            <p className="text-sm text-on-muted">
              This modal is controlled using the useModal hook, which provides
              convenient state management and imperative controls.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Close>
              <Button variant="outline">Cancel</Button>
            </Modal.Close>
            <Button onClick={handleConfirm}>Confirm</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 5: Backdrop Variants
export function BackdropModalExample() {
  const backdrops: Array<ModalVariants["backdrop"]> = ["blur", "dark", "light", "transparent", "none"];
  const [currentBackdrop, setCurrentBackdrop] = useState<ModalVariants["backdrop"] | null>(null);

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Backdrop Variants</h4>

      <div className="flex flex-wrap gap-2">
        {backdrops.map((backdrop) => (
          <Button
            key={backdrop}
            variant="outline"
            size="sm"
            onClick={() => setCurrentBackdrop(backdrop)}
          >
            {backdrop.charAt(0).toUpperCase() + backdrop.slice(1)}
          </Button>
        ))}
      </div>

      <Modal
        open={currentBackdrop !== null}
        onOpenChange={() => setCurrentBackdrop(null)}
        backdrop={currentBackdrop || "blur"}
      >
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">{currentBackdrop} Backdrop</h2>
          </Modal.Header>

          <Modal.Body>
            <p className="text-sm text-on-muted">
              This modal uses the "{currentBackdrop}" backdrop style.
              {currentBackdrop === "blur" && " Blur backdrop creates a frosted glass effect."}
              {currentBackdrop === "none" && " No backdrop allows interaction with background content."}
              {currentBackdrop === "transparent" && " Transparent backdrop has no visual overlay."}
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Close>
              <Button variant="outline">Close</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 6: Animation Variants
export function AnimationModalExample() {
  const animations: Array<ModalVariants["animation"]> = ["fade", "scale", "slide-up", "slide-down", "slide-left", "slide-right", "none"];
  const [currentAnimation, setCurrentAnimation] = useState<ModalVariants["animation"] | null>(null);

  return (
    <div className="space-y-6 w-full">
      <h4 className="text-sm font-medium text-fg">Animation Variants</h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {animations.map((animation) => (
          <Button
            key={animation}
            variant="outline"
            size="sm"
            onClick={() => setCurrentAnimation(animation)}
          >
            {animation.charAt(0).toUpperCase() + animation.slice(1)}
          </Button>
        ))}
      </div>

      <Modal
        open={currentAnimation !== null}
        onOpenChange={() => setCurrentAnimation(null)}
        animation={currentAnimation || "scale"}
      >
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">{currentAnimation} Animation</h2>
          </Modal.Header>

          <Modal.Body>
            <p className="text-sm text-on-muted">
              This modal uses the "{currentAnimation}" animation. Try closing and reopening
              to see the animation effect in action.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Close>
              <Button variant="outline">Close</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 7: Form Modal
export function FormModalExample() {
  const { success, error } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium"
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      error("Validation Error", "Title is required");
      return;
    }

    success("Task Created", `Task "${formData.title}" created successfully`);
    setIsOpen(false);
    setFormData({ title: "", description: "", priority: "medium" });
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Form Modal</h4>

      <Button onClick={() => setIsOpen(true)}>Create New Task</Button>

      <Modal open={isOpen} onOpenChange={setIsOpen} size="lg">
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">Create New Task</h2>
          </Modal.Header>

          <Modal.Body scrollable>
            <div className="space-y-4">
              <Input
                label="Task Title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title..."
              />

              <Textarea
                label="Description"
                value={formData.description}
                onValueChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="Describe the task..."
                minRows={3}
                maxLength={500}
                characterCount
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  className="w-full p-2 border border-border rounded-md text-sm"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Modal.Close>
              <Button variant="outline">Cancel</Button>
            </Modal.Close>
            <Button onClick={handleSubmit}>Create Task</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 8: Persistent Modal
export function PersistentModalExample() {
  const { info, warning } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleForceClose = () => {
    setAttempts(prev => prev + 1);
    if (attempts >= 2) {
      info("Modal Closed", "Modal finally closed after multiple attempts");
      setIsOpen(false);
      setAttempts(0);
    } else {
      warning("Persistent Modal", `Attempt ${attempts + 1}/3 - Modal won't close easily!`);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Persistent Modal</h4>

      <Button onClick={() => setIsOpen(true)} variant="outline">
        Open Persistent Modal
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        persistent={true}
        closeOnBackdropClick={false}
        closeOnEscapeKey={false}
      >
        <Modal.Content>
          <Modal.Header showCloseButton={false}>
            <h2 className="text-lg font-semibold">⚠️ Persistent Modal</h2>
          </Modal.Header>

          <Modal.Body>
            <div className="space-y-4">
              <p className="text-sm text-on-muted">
                This modal is persistent and cannot be closed by clicking the backdrop
                or pressing Escape. You must use the action buttons.
              </p>

              {attempts > 0 && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
                  <p className="text-xs text-warning-foreground">
                    Attempts to close: {attempts}/3
                  </p>
                </div>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline" onClick={handleForceClose}>
              Try to Close ({attempts}/3)
            </Button>
            <Button onClick={() => {
              info("Action Completed", "Required action completed");
              setIsOpen(false);
              setAttempts(0);
            }}>
              Complete Action
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 9: Scrollable Modal
export function ScrollableModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const generateContent = () => {
    const items = Array.from({ length: 50 }, (_, i) => (
      <div key={i} className="p-4 border border-border rounded-md">
        <h4 className="font-medium">Item {i + 1}</h4>
        <p className="text-sm text-on-muted mt-1">
          This is item {i + 1} in the scrollable list. The modal body
          can be scrolled independently while the header and footer remain fixed.
        </p>
      </div>
    ));

    return items;
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Scrollable Modal</h4>

      <Button onClick={() => setIsOpen(true)} variant="outline">
        Open Scrollable Modal
      </Button>

      <Modal open={isOpen} onOpenChange={setIsOpen} size="lg">
        <Modal.Content>
          <Modal.Header>
            <h2 className="text-lg font-semibold">Scrollable Content</h2>
          </Modal.Header>

          <Modal.Body scrollable>
            <div className="space-y-4 max-h-96">
              {generateContent()}
            </div>
          </Modal.Body>

          <Modal.Footer sticky>
            <Modal.Close>
              <Button variant="outline">Close</Button>
            </Modal.Close>
            <Button>Save Changes</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

// Example 10: Custom Styled Modal
export function CustomStyledModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Custom Styled Modal</h4>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        Open Premium Modal
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        backdrop="blur"
        animation="scale"
        size="md"
      >
        <Modal.Content>
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-lg overflow-hidden">
            <Modal.Header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">✨ Premium Features</h2>
              </div>
            </Modal.Header>

            <Modal.Body className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
              <div className="space-y-4">
                <p className="text-center text-purple-800">
                  Unlock the full potential of our platform with premium features.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    "🚀 Advanced Analytics",
                    "🎨 Custom Themes",
                    "⚡ Priority Support",
                    "🔐 Enhanced Security",
                    "📊 Detailed Reports"
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/60 rounded-md backdrop-blur-sm"
                    >
                      <span className="text-lg">{feature.split(' ')[0]}</span>
                      <span className="text-sm font-medium text-purple-800">
                        {feature.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="bg-white/60 backdrop-blur-sm border-none">
              <Modal.Close>
                <Button variant="outline" className="border-purple-200 text-purple-700">
                  Maybe Later
                </Button>
              </Modal.Close>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Upgrade Now
              </Button>
            </Modal.Footer>
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
}