import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

export const expandAndStaggerAnimation = trigger('expandAndStagger', [
  state('collapsed', style({ height: '0px', overflow: 'hidden' })),
  state('expanded', style({ height: '*', overflow: 'hidden' })),
  transition('collapsed => expanded', [
    animate('300ms ease-out'),
    query('.item', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      stagger(100, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]),
  transition('expanded => collapsed', [
    animate('300ms ease-in')
  ])
]);