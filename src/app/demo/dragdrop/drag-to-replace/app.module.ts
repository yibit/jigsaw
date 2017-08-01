import {NgModule} from "@angular/core";
import {DragToReplaceDemoComponent} from "./app.component";
import {JigsawDraggableModule, JigsawDroppableModule} from "jigsaw/directive/dragdrop/index";

@NgModule({
    imports: [JigsawDraggableModule, JigsawDroppableModule],
    declarations: [DragToReplaceDemoComponent],
    bootstrap: [DragToReplaceDemoComponent]
})
export class DragToReplaceDemoModule{

}
