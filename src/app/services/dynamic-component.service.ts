import {
  ComponentRef,
  Injectable,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DynamicComponentService {
  private componentReferences: ComponentRef<any>[] = [];

  public createComponent(
    container: ViewContainerRef,
    component: Type<any>
  ): ComponentRef<any> {
    let componentRef: ComponentRef<any>;

    componentRef = container.createComponent(component);
    container.insert(componentRef.hostView);
    this.componentReferences.push(componentRef);
    return componentRef;
  }

  public removeComponents(component: Type<any>) {
    this.componentReferences.forEach((ref: ComponentRef<void>) => {
      if (component === ref.componentType) ref.destroy();
    });
  }
}
