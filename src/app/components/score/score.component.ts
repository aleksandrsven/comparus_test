import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  @Input('playerScore') playerScore: number = 0;
  @Input('computerScore') computerScore: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
